# Refactoring Plan

This document outlines the phased approach to refactor the codebase, addressing identified anti-patterns, race conditions, loading issues, and outdated Svelte syntax.

## Phase 1: Restore and Refactor `FAQSection.svelte` (High Priority)

**Goal:** Restore the `FAQSection.svelte` file to its original state and then refactor it to eliminate anti-patterns, improve reactivity, and ensure robust animation handling.

### Tasks:

- [ ] **Restore `FAQSection.svelte` content:** This is a critical prerequisite. The file appears to be truncated, and its original content must be recovered before any refactoring can begin.
- [ ] **Replace `document.querySelector` with `bind:this`:** Update the Svelte template to use `bind:this` for direct element references instead of querying the DOM.
- [ ] **Remove `setTimeout(..., 150)` "Golden Delay":** Eliminate the artificial delay used to work around DOM synchronization issues.
- [ ] **Integrate GSAP animations directly within `$effect` blocks:** Ensure animations are triggered reactively and cleaned up properly using `gsap.context().revert()`.
- [ ] **Refactor interactive card event listeners:** Replace manual `addEventListener`/`removeEventListener` with Svelte's idiomatic event handling or proper `onMount`/`onDestroy` cleanup for global listeners.
- [ ] **Ensure proper content and direction handling:** Verify that text content and `dir` attributes are managed reactively by Svelte, not through direct DOM manipulation (`textContent`, `innerHTML`).
- [ ] **Update Svelte 4 syntax to Svelte 5 runes:** Migrate any remaining Svelte 4 reactive statements (`$:`) or `export let` declarations to Svelte 5's `$state`, `$derived`, and `$props` runes.
  - **Svelte 4 to Svelte 5 Runes Migration Guide:**
    - **Props:**
      - Old: `export let value: string;`
      - New: `const { value } = $props<{ value: string }>();`
    - **State:**
      - Old: `let count = 0;`
      - New: `let count = $state(0);`
    - **Derived State:**
      - Old: `$: doubled = count * 2;`
      - New: `const doubled = $derived(count * 2);`
    - **Effects (Side Effects):**
      - Old: `$: console.log(count);`
      - New: `$effect(() => { console.log(count); });`
    - **Two-way Binding:**
      - Old: `<input bind:value={name} />`
      - New: `<input bind:value={name} />` (remains largely the same, but `name` would be a `$state` variable)
    - **Component Lifecycle (onMount/onDestroy):**
      - Old: `import { onMount, onDestroy } from 'svelte';`
      - New: `import { onMount, onDestroy } from 'svelte';` (still relevant for non-reactive side effects or DOM interactions outside of Svelte's reactivity graph)
    - **Context API:**
      - Old: `import { setContext, getContext } from 'svelte';`
      - New: `import { setContext, getContext } from 'svelte';` (still relevant)
    - **Slots:**
      - Old: `<slot />`, `<slot name="header" />`
      - New: `<slot />`, `<slot name="header" />` (still relevant)
    - **Event Handling:**
      - Old: `<button on:click={handleClick}>`
      - New: `<button on:click={handleClick}>` (still relevant)
    - **Actions:**
      - Old: `<div use:myAction />`
      - New: `<div use:myAction />` (still relevant)
    - **Transitions/Animations:**
      - Old: `import { fade } from 'svelte/transition'; <div transition:fade />`
      - New: `import { fade } from 'svelte/transition'; <div transition:fade />` (still relevant, but often combined with `$effect` for more complex scenarios)
    - **`bind:this`:**
      - Old: `<div bind:this={myDiv}>`
      - New: `<div bind:this={myDiv}>` (still relevant, especially for integrating with third-party libraries like GSAP)

## Phase 2: Systemic Anti-pattern Elimination (Component by Component)

**Goal:** Apply the lessons learned from `FAQSection.svelte` to other components exhibiting similar anti-patterns (e.g., "Golden Delay", direct DOM manipulation, manual event handling).

### Components to Refactor:

- [ ] `FAQSection.svelte` (already in Phase 1, but listed here for completeness of anti-pattern)
- [ ] `WhyChooseUsSection.svelte` - **Specific Task:** Replace `document.querySelector` for `.section-title` and `.cinematic-glass-badge` elements with `bind:this`. - **Specific Task:** Remove 150ms "Golden Delay" setTimeout used for DOM synchronization. - **Specific Task:** Ensure `mouseenter`, `mousemove`, and `mouseleave` event listeners on `.why-item` elements are properly removed in `onDestroy`. - **Specific Task:** Replace direct `setAttribute('dir', ...)` and `textContent = ...` with Svelte's reactive binding for title and badge content and direction. - **Specific Task:** Replace `innerHTML = ...` for brand highlighting with Svelte's reactive rendering of `<span>` elements or `{html ...}` block. - **Specific Task:** Replace hardcoded `rgba` color values in `style` attributes (e.g., for `card-glow` and `box-shadow`) with theme tokens or CSS variables.

- [ ] `FeaturesSection.svelte`

          - **Specific Task:** Replace hardcoded `rgba` color values in `style` attributes (e.g., for `card-glow` and `shadow`) with theme tokens or CSS variables.
          - **Specific Task:** Replace `document.querySelector` and `document.querySelectorAll` for `.section-title`, `.section-description`, `.cinematic-glass-badge`, and `.feature-card` elements with `bind:this`.
          - **Specific Task:** Remove 150ms "Golden Delay" setTimeout used for DOM synchronization.
          - **Specific Task:** Ensure `mouseenter`, `mousemove`, and `mouseleave` event listeners on `.feature-card` elements are properly removed in `onDestroy`.
          - **Specific Task:** Replace direct `setAttribute('dir', ...)` and `innerHTML` usage for `.section-title` and `textContent` for `.section-description`, `.feature-card h3`, `.feature-card p`, and `.feature-card .uppercase` with Svelte's reactive binding.

- [ ] `+page.svelte` (root)
  - **Specific Task:** Replace `setTimeout(..., 120)` "Golden Delay" with Svelte's reactive mechanisms or `tick()`.
  - **Specific Task:** Replace `document.querySelector` with `bind:this` for all elements targeted for animation or content manipulation (e.g., `.hero-headline`, `.hero-subheadline`, `.hero-badge-text`, `.hero-buttons`, `.btn-primary span`, `a:last-child span`).
  - **Specific Task:** Replace direct `setAttribute('dir', ...)` and `textContent = ...` with Svelte's reactive binding for headline, subheadline, badge, and CTA button content and direction.
  - **Specific Task:** Refactor manual `addEventListener` calls for `.interactive-card` elements in `onMount` to use Svelte's `on:event` directives or ensure proper cleanup in `onDestroy`.
  - **Specific Task:** Replace `gsap.utils.toArray` with Svelte's template iteration and `bind:this` for elements where possible.
  - **Specific Task:** Ensure `headlineSplit` and `subheadlineSplit` (from SplitType) are properly reverted in `onDestroy` to prevent memory leaks.
- [ ] `CtaSection.svelte`
  - **Specific Task:** Replace `setTimeout(..., 150)` "Golden Delay" with Svelte's reactive mechanisms or `tick()`.
  - **Specific Task:** Replace `document.querySelector` with `bind:this` for all elements targeted for animation or content manipulation (e.g., `.section-title`, `.section-description`, `.cinematic-glass-badge`, `.btn-primary-text`, `.btn-secondary-text`, `.interactive-card`, `.card-glow`).
  - **Specific Task:** Replace direct `setAttribute('dir', ...)` and `textContent = ...` with Svelte's reactive binding for title, description, badge, and button content and direction.
  - **Specific Task:** Replace `innerHTML = ...` for brand highlighting with Svelte's reactive rendering of `<span>` elements or `{html ...}` block.
  - **Specific Task:** Refactor manual `addEventListener` calls for `.interactive-card` elements to use Svelte's `on:event` directives, ensuring proper cleanup.
- [ ] `about/+page.svelte`
  - **Specific Task:** Replace `setTimeout(..., 150)` "Golden Delay" with Svelte's reactive mechanisms or `tick()`.
  - **Specific Task:** Replace `document.querySelector` with `bind:this` for `.hero-title` and `.hero-subtitle` elements.
  - **Specific Task:** Replace direct `setAttribute('dir', ...)` and `textContent = ...` with Svelte's reactive binding for title and subtitle content and direction.
  - **Specific Task:** Ensure `mousemove` and `mouseleave` event listeners on `.interactive-card` elements are properly removed in `onDestroy`.
  - **Specific Task:** Review and ensure proper cleanup/reset of the global `particles` array and related state if the component is frequently mounted/unmounted. - **Specific Task:** Replace `setTimeout(..., 150)` "Golden Delay" with Svelte's reactive mechanisms or `tick()`. - **Specific Task:** Replace `document.querySelector` with `bind:this` for `.hero-title` and `.hero-subtitle` elements. - **Specific Task:** Replace direct `setAttribute('dir', ...)` and `textContent = ...` with Svelte's reactive binding for title and subtitle content and direction. - **Specific Task:** Ensure `mousemove` and `mouseleave` event listeners on `.interactive-card` elements are properly removed in `onDestroy`. - **Specific Task:** Review and ensure proper cleanup/reset of the global `particles` array and related state if the component is frequently mounted/unmounted.
- [ ] `SocialProofSection.svelte`
  - **Specific Task:** Replace `setTimeout(..., 150)` "Golden Delay" with Svelte's reactive mechanisms or `tick()`.
  - **Specific Task:** Replace `document.querySelector` and `document.querySelectorAll` with `bind:this` for `.section-title`, `.section-description`, `.cinematic-glass-badge`, and `.stat-card` elements.
  - **Specific Task:** Replace direct `setAttribute('dir', ...)` and `textContent = ...` with Svelte's reactive binding for title, description, and stat card content and direction.
  - **Specific Task:** Ensure `mouseenter`, `mousemove`, and `mouseleave` event listeners on `.stat-card` elements are properly removed in `onDestroy` or managed reactively by Svelte.
  - **Specific Task:** Replace hardcoded `rgba` color values (e.g., `rgba(var(--color-brand-blue-rgb), 0.15)`) with theme tokens or CSS variables for alpha values.
  - **Specific Task:** Replace `setTimeout(..., 150)` "Golden Delay" with Svelte's reactive mechanisms or `tick()`.
  - **Specific Task:** Replace `document.querySelector` and `document.querySelectorAll` with `bind:this` for `.section-title`, `.section-description`, `.cinematic-glass-badge`, and `.stat-card` elements.
  - **Specific Task:** Replace direct `setAttribute('dir', ...)` and `textContent = ...` with Svelte's reactive binding for title, description, and stat card content and direction.
  - **Specific Task:** Ensure `mouseenter`, `mousemove`, and `mouseleave` event listeners on `.stat-card` elements are properly removed in `onDestroy` or managed reactively by Svelte.
- [ ] `ServicesSection.svelte`
  - **Specific Task:** Replace `setTimeout(..., 150)` "Golden Delay" with Svelte's reactive mechanisms or `tick()`.
  - **Specific Task:** Replace `document.querySelector` and `document.querySelectorAll` with `bind:this` for `#services .section-title`, `#services .section-description`, `#services .cinematic-glass-badge`, `.service-card-container`, `.interactive-card`, and `.card-glow` elements.
  - **Specific Task:** Replace direct `setAttribute('dir', ...)` and `textContent = ...` with Svelte's reactive binding for title, description, and service card content and direction.
  - **Specific Task:** Replace `innerHTML = ...` for brand highlighting with Svelte's reactive rendering of `<span>` elements or `{html ...}` block.
  - **Specific Task:** Replace manual `addEventListener` for `mouseenter`, `mousemove`, and `mouseleave` on service cards with Svelte's `on:event` directives, ensuring proper cleanup.
  - **Specific Task:** Replace hardcoded `rgba` color values (e.g., `rgba(0, 119, 255, 0.03)`) with theme tokens or CSS variables for alpha values.
- [ ] `CustomCursor.svelte`
  - **Specific Task:** Ensure `window.removeEventListener('mousemove', moveCursor)` is called in `onDestroy`.
  - **Specific Task:** Ensure `removeEventListener` is called for `mouseenter` and `mouseleave` on all `interactiveElements` in `onDestroy` to prevent memory leaks.
  - **Specific Task:** Consider using Svelte's `use:` directive for interactive elements if they are within the component's scope, or a more robust global event management system.
  - **Specific Task:** Replace hardcoded color fallbacks (e.g., `#0b9ddb`, `rgba(11, 157, 219, 0.1)`) with theme tokens or CSS variables.

- [ ] `TestimonialSection.svelte`
  - **Specific Task:** Replace `document.querySelector` for `title` and `description` with `bind:this`.
  - **Specific Task:** Replace manual `setAttribute('dir', ...)` and `textContent = ...` for `title` and `description` elements with Svelte's reactive binding.
  - **Specific Task:** Replace `innerHTML` usage for brand highlighting with Svelte's reactive templating (e.g., `{html ...}` or reactive `<span>` elements).
  - **Specific Task:** Ensure `mouseenter`, `mousemove`, and `mouseleave` event listeners on `.testimonial-card` elements are properly removed in `onDestroy` or managed reactively by Svelte's `on:event` directives.
  - **Specific Task:** Ensure `mouseenter` and `mouseleave` event listeners on `marqueeRef` are properly removed in `onDestroy`.
  - **Specific Task:** Replace `document.querySelector` for `title` and `description` with `bind:this`.
  - **Specific Task:** Replace manual `setAttribute('dir', ...)` and `textContent = ...` for `title` and `description` elements with Svelte's reactive binding.
  - **Specific Task:** Replace `innerHTML` usage for brand highlighting with Svelte's reactive templating (e.g., `{html ...}` or reactive `<span>` elements).
  - **Specific Task:** Ensure `mouseenter`, `mousemove`, and `mouseleave` event listeners on `.testimonial-card` elements are properly removed in `onDestroy` or managed reactively by Svelte's `on:event` directives.
  - **Specific Task:** Ensure `mouseenter` and `mouseleave` event listeners on `marqueeRef` are properly removed in `onDestroy`.
- [ ] `PricingSection.svelte`
  - **Specific Task:** Replace `document.querySelectorAll('.interactive-card')` with `bind:this` for each interactive card.
  - **Specific Task:** Replace manual `addEventListener` for `mouseenter`, `mousemove`, and `mouseleave` on interactive cards with Svelte's `on:event` directives, ensuring proper cleanup in `onDestroy`.
  - **Specific Task:** Optimize `getBoundingClientRect()` calls by calculating `rect` once on `mouseenter` or `onMount` and only re-calculating if the card's position/size changes (e.g., on window resize).
  - **Specific Task:** Replace hardcoded `rgba` color values in `style` attributes (e.g., for `card-glow`) with theme tokens or CSS variables.
- [ ] `AdditionalFeaturesSection.svelte`
  - **Specific Task:** Replace `document.querySelectorAll('.interactive-card')` with `bind:this` for each interactive card.
  - **Specific Task:** Replace manual `addEventListener` for `mouseenter`, `mousemove`, and `mouseleave` on interactive cards with Svelte's `on:event` directives, ensuring proper cleanup in `onDestroy`.
  - **Specific Task:** Optimize `getBoundingClientRect()` calls by calculating `rect` once on `mouseenter` or `onMount` and only re-calculating if the card's position/size changes (e.g., on window resize).
  - **Specific Task:** Replace hardcoded `rgba` color values in `style` attributes with theme tokens or CSS variables (e.g., for `background` and `box-shadow` of glow effects).
- [ ] `RecentWorkSection.svelte`
  - **Specific Task:** Replace `document.querySelectorAll('.project-card')` with `bind:this` for each project card.
  - **Specific Task:** Replace manual `addEventListener` for `mouseenter`, `mousemove`, and `mouseleave` on project cards with Svelte's `on:event` directives, ensuring proper cleanup in `onDestroy`.
  - **Specific Task:** Optimize `getBoundingClientRect()` calls by calculating `rect` once on `mouseenter` or `onMount` and only re-calculating if the card's position/size changes (e.g., on window resize).
  - **Specific Task:** Replace `document.querySelector('#recent-work .section-title')` and `document.querySelector('#recent-work .section-description')` with `bind:this` for the title and description elements.
  - **Specific Task:** Ensure GSAP animations for the title and description are properly managed within Svelte's lifecycle, potentially using `gsap.context` for better cleanup.
  - **Specific Task:** Replace hardcoded `rgba` color values in `style` attributes and Tailwind classes with theme tokens or CSS variables (e.g., for `background-color` and `box-shadow` of glow effects).
  - **Specific Task:** Ensure `SplitType` instances (`titleSplit`, `descSplit`) are properly destroyed in `onDestroy` to prevent memory leaks.
- [ ] `TrustSection.svelte`
  - **Specific Task:** Replace `document.querySelectorAll('.interactive-card')` with `bind:this` for each interactive card.
  - **Specific Task:** Replace manual `addEventListener` for `mouseenter`, `mousemove`, and `mouseleave` on interactive cards with Svelte's `on:event` directives, ensuring proper cleanup in `onDestroy`.
  - **Specific Task:** Optimize `getBoundingClientRect()` calls by calculating `rect` once on `mouseenter` or `onMount` and only re-calculating if the card's position/size changes (e.g., on window resize).
  - **Specific Task:** Replace hardcoded `rgba` color values in `style` attributes with theme tokens or CSS variables (e.g., for `background` and `box-shadow` of glow effects).
  - **Specific Task:** Ensure `mouseenter`, `mousemove`, and `mouseleave` event listeners on `.interactive-card` elements are properly removed in `onDestroy`.
- [ ] `MetricsBand.svelte`
  - **Specific Task:** Replace `document.querySelectorAll('.metric-card')` with `bind:this` for each metric card.
  - **Specific Task:** Replace manual `addEventListener` for `mousemove` and `mouseleave` on metric cards with Svelte's `on:event` directives, ensuring proper cleanup in `onDestroy`.
  - **Specific Task:** Optimize `getBoundingClientRect()` calls by calculating `rect` once on `mouseenter` or `onMount` and only re-calculating if the card's position/size changes (e.g., on window resize).
  - **Specific Task:** Replace hardcoded `rgba` color values in `shadow-[0_0_15px_rgba(0,119,255,0.3)]` with theme tokens or CSS variables.
- [ ] `Header.svelte`
  - **Analysis:** This component is already well-written and utilizes modern Svelte 5 patterns (`$state`, `$derived`, `$effect`). No specific anti-pattern refactoring tasks are required at this time.
- [ ] `DrawerNavigation.svelte`
  - **Analysis:** This component is also well-written and utilizes modern Svelte 5 patterns (`$state`, `$derived`, `$props`). No specific anti-pattern refactoring tasks are required at this time.

### General Tasks for Each Component:

- [ ] Replace `document.querySelector` with `bind:this` for element references.
- [ ] Remove `setTimeout(..., 150)` "Golden Delay".
- [ ] Integrate GSAP animations directly within `$effect` blocks with proper cleanup (`gsap.context().revert()`).
- [ ] Refactor event listeners for interactive elements to use Svelte's event handling or `onMount`/`onDestroy` for global listeners.
- [ ] Ensure proper handling of `dir` attributes and content for translations.

- [ ] `ThemeToggle.svelte`
  - **Analysis:** This component is well-written and utilizes modern Svelte 5 patterns (`$state`, `bind:this`). No specific anti-pattern refactoring tasks are required at this time.

- [ ] `Header.svelte`
  - **Analysis:** This component is also well-written and utilizes modern Svelte 5 patterns (`$state`, `$derived`, `$effect`). It correctly uses `bind:this` for element references and reactive patterns for updating styles. No specific anti-pattern refactoring tasks are required at this time.

- [ ] `DrawerNavigation.svelte`
  - **Analysis:** This component is also well-written and utilizes modern Svelte 5 patterns (`$state`, `$derived`, `$props`). It correctly uses Svelte's event handling and transitions, and avoids direct DOM manipulation or `setTimeout` for animations.

- [ ] `Hero3D.svelte`
  - **Specific Task:** Replace hardcoded color constants (`PURE_BLUE`, `CORE_GLOW`, `PURE_ORANGE`) with theme tokens or CSS variables.

### Phase 3: Performance Optimization, Build Process, and Final Review

This phase focuses on optimizing the application's performance, refining the build process, and conducting a final review to ensure all changes are integrated seamlessly and do not introduce regressions.

- [ ] Review `Hero3D.svelte` for Svelte 5 alignment and potential optimizations.
- [ ] Implement image and asset optimization (e.g., WebP, AVIF, responsive images).
- [ ] Implement code splitting and component lazy loading for improved initial load times.
- [ ] Run lint and typecheck to ensure code quality and catch any remaining errors.
- [ ] Ensure compatibility with existing 3D objects and animations. This is a critical step to verify that all refactoring efforts have not negatively impacted the existing visual and interactive elements.
