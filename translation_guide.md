# 🌍 Orcado Translation & Reactivity Guide

This guide documents the proven patterns discovered while fixing the Home Hero and About sections. Follow these rules to ensure smooth, flicker-free, and reactive translations across all sections of the Home Page.

---

## 🚀 The Core Architecture

To achieve the "About Page" smoothness, we use a three-layered approach to reactivity:

1. **State Management**: Using SvelteKit `depends('app:language')` and `invalidate('app:language')` to force data re-fetching.
2. **DOM Management**: Using `{#key data.lang}` to selectively recreate components or text blocks.
3. **Animation Management**: Using GSAP `context()` within Svelte's `$effect` and `bind:this` for direct DOM references, ensuring proper cleanup with `ctx.revert()` and `onDestroy`.

---

## 🛠 Proven Patterns

### 1. The Selective `{#key}` Block

**Don't** wrap entire sections in a `{#key}` block. This causes massive layout shifts.
**Do** wrap only the text elements that require split-text animations (Title, Subtitle).

```svelte
<!-- BAD: Recreates everything -->
{#key data.lang}
	<section>...</section>
{/key}

<!-- GOOD: Recreates only animated text -->
<div class="static-layout">
	{#key data.lang}
		<h1 class="hero-title">{data.title}</h1>
	{/key}
	<button>{data.cta}</button>
	<!-- Instant update via Svelte -->
</div>
```

### 2. The Flicker-Free Initial State (CSS)

Always set elements to `opacity: 0` in CSS if they are animated by GSAP on mount/switch. This prevents the "flash" of untranslated or un-animated content.

```css
.hero-title,
.hero-subtitle {
	opacity: 0;
}
```

### 3. The GSAP Reactive Animation Pattern

Use a `$effect` block that tracks relevant dependencies (e.g., `data.lang`, `data.title`). Leverage `bind:this` to get direct references to DOM elements, eliminating the need for `setTimeout` or `document.querySelector`. Ensure proper cleanup using `gsap.context()`'s `revert()` method in the `$effect`'s cleanup function.

```svelte
<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import SplitType from 'split-type';

	gsap.registerPlugin(ScrollTrigger);

	// Props and reactive state
	export let title: string;
	export let description: string;
	export let lang: 'en' | 'ar';

	// Direct DOM references using bind:this
	let titleElement: HTMLElement;
	let descriptionElement: HTMLElement;
	let badgeElement: HTMLElement; // Example

	// Reactive variable to trigger animation logic
	// This will re-run the $effect block when title, description, or lang changes
	$: animationDependencies = { title, description, lang };

	$effect(() => {
		if (typeof window === 'undefined' || !titleElement || !descriptionElement) return;

		// Use tick() if animation depends on DOM updates from reactive changes
		// await tick();

		const isAr = lang === 'ar';

		// GSAP Context for proper cleanup
		const ctx = gsap.context(() => {
			// Clear existing animations and set initial state
			gsap.killTweensOf([badgeElement, titleElement, descriptionElement]);
			gsap.set([badgeElement, titleElement, descriptionElement], {
				clearProps: 'all',
				opacity: 0,
				visibility: 'visible'
			});

			// Update content and attributes directly
			titleElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
			descriptionElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
			titleElement.textContent = title;
			descriptionElement.textContent = description;

			// Apply brand highlight (example)
			// ... (logic for applying brand highlight) ...

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: titleElement, // Use a direct element reference for the trigger
					start: 'top 85%',
					toggleActions: 'play none none none'
				}
			});

			if (isAr) {
				// Arabic Reveal Logic
				gsap.set([titleElement, descriptionElement], { opacity: 1, clipPath: 'inset(0 0 0 100%)' });

				tl.to(badgeElement, {
					/* ... */
				})
					.to(titleElement, {
						/* ... */
					})
					.to(descriptionElement, {
						/* ... */
					});
			} else {
				// English Character Logic
				gsap.set([titleElement, descriptionElement], { opacity: 1 });

				const titleSplit = new SplitType(titleElement, { types: 'chars,words' });
				const descSplit = new SplitType(descriptionElement, { types: 'chars' });

				tl.to(badgeElement, {
					/* ... */
				})
					.from(titleSplit.chars, {
						/* ... */
					})
					.from(descSplit.chars, {
						/* ... */
					});
			}

			ScrollTrigger.refresh();
		});

		// Cleanup function for the $effect block
		return () => {
			ctx.revert(); // Revert all GSAP animations created in this context
		};
	});

	// For global event listeners or things that only need to run once on mount
	onMount(() => {
		// Example: Add a global event listener
		// const handleResize = () => { /* ... */ };
		// window.addEventListener('resize', handleResize);

		return () => {
			// Example: Clean up the global event listener
			// window.removeEventListener('resize', handleResize);
		};
	});
</script>

<div class="section-container">
	<span class="cinematic-glass-badge" bind:this={badgeElement}>Badge Text</span>
	<h2 class="section-title" bind:this={titleElement}></h2>
	<p class="section-description" bind:this={descriptionElement}></p>
</div>
```

---

## ⚠️ Common Pitfalls & Solutions

| Issue                  | Cause                                                                               | Solution                                                                                                                                                                                                                                 |
| :--------------------- | :---------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Split Arabic Chars** | SplitType breaks ligatures.                                                         | Use `clip-path` reveal for Arabic instead of `chars` split.                                                                                                                                                                              |
| **Invisible English**  | Container `opacity: 0` from CSS not reset.                                          | `gsap.set(container, { opacity: 1 })` before char animation.                                                                                                                                                                             |
| **Stale Content**      | Language cache not cleared.                                                         | Call `clearLanguageCache()` before `goto()`.                                                                                                                                                                                             |
| **Animation Jitter**   | GSAP/Svelte race condition.                                                         | Use `bind:this` for direct DOM references and `$effect` for reactive animations. Leverage `tick()` if DOM updates are needed before animation.                                                                                           |
| **Missing Data/Props** | `data` or `data.site` is `null`/`undefined` during initial load or language switch. | Implement conditional rendering (`{#if data?.site}`), optional chaining (`data?.lang`), and early returns (`if (!data) return;`) to guard against `null`/`undefined` values. Mark props as optional (`prop?: Type`) in child components. |

---

## 📋 Implementation Checklist for Sections

- [x] Element `opacity: 0` in CSS for initial hidden state?
- [x] `{#key data.lang}` wrapping only necessary text elements (e.g., for SplitType)?
- [x] `$effect` block used for animations, leveraging `bind:this` for direct element references?
- [x] `gsap.context()` used within `$effect` with `ctx.revert()` in the cleanup function?
- [x] Global event listeners (if any) added in `onMount` and cleaned up in `onDestroy`?
- [x] Arabic uses `clip-path` reveal for text animations?
- [x] English text animations handle initial opacity/visibility correctly (e.g., `gsap.set(element, { opacity: 1 })` before SplitType)?
- [x] `ScrollTrigger.refresh()` called after animation setup if layout changes?
- [x] Data and props are safely accessed using conditional rendering, optional chaining, and early returns?

---

> **Note**: This pattern ensures the UI feels like a single-page application where content "flows" between languages rather than "reloading".
