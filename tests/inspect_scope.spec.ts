import { test, expect } from '@playwright/test';

test('inspect sticky scope height', async ({ page }) => {
	await page.goto('http://localhost:3002');

	// The sticky scope is the parent of hero3DContainer
	const stickyScope = page.locator('div.relative:has(canvas)');
	const heroSection = page.locator('.hero-section');
	const featuresSection = page.locator('#features');

	const scopeBox = await stickyScope.boundingBox();
	const heroBox = await heroSection.boundingBox();
	const featuresBox = await featuresSection.boundingBox();

	console.log(`Sticky Scope: ${JSON.stringify(scopeBox)}`);
	console.log(`Hero Section: ${JSON.stringify(heroBox)}`);
	console.log(`Features Section: ${JSON.stringify(featuresBox)}`);

	// Check if features is actually inside the scope in the DOM
	const isInside = await page.evaluate(() => {
		const scope = document.querySelector('div.relative:has(canvas)');
		const features = document.querySelector('#features');
		return scope && features ? scope.contains(features) : false;
	});
	console.log(`Is Features inside Sticky Scope: ${isInside}`);
});
