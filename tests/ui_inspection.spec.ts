import { test, expect } from '@playwright/test';

test('inspect ui state and identify missing elements based on stunnishing.md', async ({ page }) => {
	// Point to the local dev server
	page.on('console', (msg) => {
		if (msg.type() === 'error') console.log(`PAGE ERROR: ${msg.text()}`);
		else console.log(`PAGE LOG: ${msg.text()}`);
	});

	await page.goto('http://localhost:3002');

	console.log('--- UI Inspection Report ---');

	// 1. Check for Lenis (Smooth Scroll)
	const hasLenis = await page.evaluate(
		() => !!(window as any).lenis || document.documentElement.classList.contains('lenis')
	);
	console.log(`[Smooth Scroll] Lenis detected: ${hasLenis}`);

	// 2. Check for Hero 3D Scene
	const canvas = await page.locator('canvas').first();
	const canvasCount = await canvas.count();
	console.log(`[3D Scene] Canvas elements found: ${canvasCount}`);
	if (canvasCount > 0) {
		const isHero3D = await canvas.evaluate(
			(el) => el.closest('section')?.innerHTML.includes('hero') || false
		);
		console.log(`[3D Scene] Hero 3D Scene detected: ${isHero3D}`);
	}

	// 3. Check for GSAP
	const hasGSAP = await page.evaluate(() => !!(window as any).gsap);
	console.log(`[Animations] GSAP detected: ${hasGSAP}`);

	// 4. Check for Semantic Design Tokens (app.css)
	const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
	console.log(`[Styling] Body background: ${bodyBg}`);

	// 5. Check for missing sections from stunnishing.md
	const sectionIds = await page.evaluate(() => {
		return Array.from(document.querySelectorAll('section')).map((s) => s.id || s.className);
	});
	console.log(`[Structure] Detected sections/classes: ${sectionIds.join(', ')}`);

	// 6. Identify Missing/Needed Fixes
	console.log('\n--- Missing Elements & Needed Fixes ---');
	if (!hasLenis) console.log('- MISSING: Lenis smooth scroll integration');
	if (canvasCount === 0) console.log('- MISSING: Threlte/Three.js Hero 3D scene');

	// Check for Footer
	const footerCount = await page.locator('footer').count();
	if (footerCount === 0) console.log('- MISSING: Premium Footer');

	// Check for specific sections from stunnishing.md using IDs
	const whyUsCount = await page.locator('#why-choose-us').count();
	const servicesCount = await page.locator('#services').count();
	const featuresCount = await page.locator('#features').count();

	if (whyUsCount === 0) console.log('- MISSING: Why Choose Us section (#why-choose-us)');
	if (servicesCount === 0) console.log('- MISSING: Services section (#services)');
	if (featuresCount === 0) console.log('- MISSING: Features section (#features)');

	// 7. Check for Cinematic Features from stunnishing.md
	const hasGlassmorphism = await page.evaluate(() => {
		const el = document.querySelector('.cinematic-glass');
		if (!el) return false;
		const style = getComputedStyle(el) as CSSStyleDeclaration & { webkitBackdropFilter: string };
		return style.backdropFilter.includes('blur') || style.webkitBackdropFilter.includes('blur');
	});
	console.log(`[Cinematic] Glassmorphism detected: ${hasGlassmorphism}`);
	if (!hasGlassmorphism) console.log('- MISSING: Glassmorphism utility usage');

	console.log('--- End of Report ---');
});
