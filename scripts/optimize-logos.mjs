import sharp from 'sharp';
import { readdir, mkdir, readFile, writeFile } from 'fs/promises';
import { join, basename, extname } from 'path';
import { existsSync } from 'fs';

const LOGOS_DIR = 'static/images/logos';
const OUTPUT_DIR = 'static/images/logos-optimized';
const TARGET_SIZE = 128;
const QUALITY = 80;

async function getAllImages(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const images = [];

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		if (entry.isFile()) {
			const ext = extname(entry.name).toLowerCase();
			if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
				images.push(fullPath);
			}
		}
	}

	return images;
}

async function optimizeImage(inputPath, outputPath) {
	const ext = extname(inputPath).toLowerCase();
	const baseName = basename(inputPath, ext);

	try {
		let image = sharp(inputPath);
		const metadata = await image.metadata();

		const width = metadata.width || TARGET_SIZE;
		const height = metadata.height || TARGET_SIZE;
		const scale = Math.min(TARGET_SIZE / width, TARGET_SIZE / height, 1);

		image = image.resize({
			width: Math.round(width * scale),
			height: Math.round(height * scale),
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 }
		});

		if (ext === '.png') {
			image = image.png({ quality: QUALITY, compressionLevel: 9 });
		} else if (ext === '.jpg' || ext === '.jpeg') {
			image = image.jpeg({ quality: QUALITY, mozjpeg: true });
		} else if (ext === '.webp') {
			image = image.webp({ quality: QUALITY });
		}

		await image.toFile(outputPath.replace(ext, '.webp'));
		console.log(`✓ Optimized: ${baseName}${ext} → ${baseName}.webp`);

		return { success: true, output: outputPath.replace(ext, '.webp') };
	} catch (error) {
		console.error(`✗ Failed: ${inputPath}`, error.message);
		return { success: false, error: error.message };
	}
}

async function updateHero3DImports() {
	const hero3DPath = 'src/lib/components/Hero3D.svelte';
	const content = await readFile(hero3DPath, 'utf-8');

	if (content.includes('.webp')) {
		console.log('Hero3D.svelte already uses .webp imports');
		return;
	}

	let updated = content;

	for (const [key, value] of Object.entries(logoMapping)) {
		updated = updated.replace(new RegExp(key, 'g'), value);
	}

	await writeFile(hero3DPath, updated);
	console.log('✓ Updated Hero3D.svelte with optimized image paths');
}

const logoMapping = {};

async function main() {
	console.log('🖼️  Image Optimization Script');
	console.log('=============================\n');

	if (!existsSync(LOGOS_DIR)) {
		console.error(`❌ Directory not found: ${LOGOS_DIR}`);
		process.exit(1);
	}

	if (!existsSync(OUTPUT_DIR)) {
		await mkdir(OUTPUT_DIR, { recursive: true });
		console.log(`✓ Created output directory: ${OUTPUT_DIR}\n`);
	}

	const images = await getAllImages(LOGOS_DIR);
	console.log(`Found ${images.length} images to optimize\n`);

	let successCount = 0;
	let failCount = 0;

	for (const imagePath of images) {
		const fileName = basename(imagePath);
		const outputPath = join(OUTPUT_DIR, fileName);

		const result = await optimizeImage(imagePath, outputPath);

		if (result.success) {
			successCount++;
			const originalExt = extname(fileName);
			const webpName = fileName.replace(originalExt, '.webp');
			logoMapping[fileName] = webpName;
		} else {
			failCount++;
		}
	}

	console.log(`\n📊 Results:`);
	console.log(`   ✓ Successful: ${successCount}`);
	console.log(`   ✗ Failed: ${failCount}`);
	console.log(`\n📁 Output directory: ${OUTPUT_DIR}`);

	if (successCount > 0) {
		console.log(`\n💡 Next steps:`);
		console.log(`   1. Review optimized images in ${OUTPUT_DIR}`);
		console.log(`   2. Replace originals: mv ${OUTPUT_DIR}/* ${LOGOS_DIR}/`);
		console.log(`   3. Update Hero3D.svelte to use .webp extensions`);
	}
}

main().catch(console.error);
