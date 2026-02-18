import { test, expect } from '@playwright/test';

test('debug 3d hero visibility', async ({ page }) => {
	await page.goto('http://localhost:3002');

	const canvas = page.locator('canvas').first();
	const features = page.locator('#features');

	console.log('--- Scrolling through Hero ---');
	await page.mouse.wheel(0, 500);
	await page.waitForTimeout(500);
	let opacity = await canvas.evaluate((el) => getComputedStyle(el).opacity);
	let visibility = await canvas.evaluate((el) => getComputedStyle(el).visibility);
	let rect = await canvas.boundingBox();
	console.log(
		`At scroll 500: Opacity=${opacity}, Visibility=${visibility}, Rect=${JSON.stringify(rect)}`
	);

	console.log('--- Scrolling to Features ---');
	await features.scrollIntoViewIfNeeded();
	await page.waitForTimeout(500);
	opacity = await canvas.evaluate((el) => getComputedStyle(el).opacity);
	visibility = await canvas.evaluate((el) => getComputedStyle(el).visibility);
	rect = await canvas.boundingBox();
	console.log(
		`At Features: Opacity=${opacity}, Visibility=${visibility}, Rect=${JSON.stringify(rect)}`
	);

	// Check if it's covered by something
	const topElement = await page.evaluate(
		({ x, y }: { x: number; y: number }) => {
			const el = document.elementFromPoint(x, y);
			return el ? { tagName: el.tagName, className: el.className, id: el.id } : null;
		},
		{ x: (rect?.x || 0) + 100, y: (rect?.y || 0) + 100 }
	);
	console.log(`Element at canvas position: ${JSON.stringify(topElement)}`);
});
