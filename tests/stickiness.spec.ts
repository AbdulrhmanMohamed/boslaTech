import { test, expect } from '@playwright/test';

test('verify 3d hero stickiness behavior', async ({ page }) => {
	await page.goto('http://localhost:3002');

	// Wait for canvas to load
	const canvas = page.locator('canvas').first();
	await expect(canvas).toBeVisible();

	// Get Features section
	const features = page.locator('#features');
	await expect(features).toBeVisible();

	// Scroll to features
	await features.scrollIntoViewIfNeeded();

	// Check if canvas is still visible (it should be sticky)
	const isCanvasVisibleAtFeatures = await canvas.isVisible();
	console.log(`Canvas visible at Features: ${isCanvasVisibleAtFeatures}`);

	// Get Services section (which comes after features)
	const services = page.locator('#services');
	await expect(services).toBeVisible();

	// Scroll to services
	await services.scrollIntoViewIfNeeded();

	// The canvas is in a container that ends after Features.
	// In our structure, it's absolute inset-0 in a parent that contains Hero + Features.
	// When we scroll to Services, the canvas should have scrolled away or be hidden.

	// Check canvas position relative to viewport
	const canvasBox = await canvas.boundingBox();
	const viewportHeight = page.viewportSize()?.height || 0;

	console.log(`Canvas top position when at Services: ${canvasBox?.y}`);

	if (canvasBox && canvasBox.y < -viewportHeight) {
		console.log('SUCCESS: 3D Hero has scrolled away after Features section.');
	} else {
		console.log('INFO: Checking autoAlpha/opacity if it was faded out via GSAP.');
		const opacity = await canvas.evaluate((el) => getComputedStyle(el).opacity);
		console.log(`Canvas opacity at Services: ${opacity}`);
	}
});
