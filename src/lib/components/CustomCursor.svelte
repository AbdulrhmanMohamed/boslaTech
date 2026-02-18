<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	let cursor: HTMLElement;
	let cursorOuter: HTMLElement;

	onMount(() => {
		if (!window.matchMedia('(pointer: fine)').matches) {
			return;
		}

		if (!window.matchMedia('(hover: hover)').matches) {
			return;
		}

		gsap.set('.custom-cursor', { xPercent: -50, yPercent: -50 });
		gsap.set('.custom-cursor-outer', { xPercent: -50, yPercent: -50 });

		const moveCursor = (e: MouseEvent) => {
			gsap.to(cursor, {
				x: e.clientX,
				y: e.clientY,
				duration: 0.1,
				ease: 'power2.out'
			});
			gsap.to(cursorOuter, {
				x: e.clientX,
				y: e.clientY,
				duration: 0.4,
				ease: 'power2.out'
			});
		};

		window.addEventListener('mousemove', moveCursor);

		const handleMouseEnter = () => {
			gsap.to(cursorOuter, {
				scale: 2.5,
				backgroundColor: 'var(--color-brand-blue-transparent, rgba(11, 157, 219, 0.1))',
				borderColor: 'var(--color-brand-blue, #0b9ddb)',
				duration: 0.3
			});
			gsap.to(cursor, {
				scale: 0.5,
				backgroundColor: 'var(--color-brand-blue, #0b9ddb)',
				duration: 0.3
			});
		};

		const handleMouseLeave = () => {
			gsap.to(cursorOuter, {
				scale: 1,
				backgroundColor: 'transparent',
				borderColor: 'rgba(255, 255, 255, 0.3)',
				duration: 0.3
			});
			gsap.to(cursor, {
				scale: 1,
				backgroundColor: 'var(--color-brand-blue, #0b9ddb)',
				duration: 0.3
			});
		};

		const interactiveElements = document.querySelectorAll(
			'a, button, select, [role="button"], .why-item, .feature-card, .service-card, .project-card, .stat-card'
		);
		interactiveElements.forEach((el) => {
			el.addEventListener('mouseenter', handleMouseEnter);
			el.addEventListener('mouseleave', handleMouseLeave);
		});

		return () => {
			window.removeEventListener('mousemove', moveCursor);
		};
	});
</script>

<div class="custom-cursor-container pointer-events-none fixed inset-0 z-[9999] hidden lg:block">
	<div
		bind:this={cursor}
		class="custom-cursor fixed top-0 left-0 h-2 w-2 rounded-full"
		style="background-color: var(--color-brand-blue, #0b9ddb);"
	></div>
	<div
		bind:this={cursorOuter}
		class="custom-cursor-outer fixed top-0 left-0 h-10 w-10 rounded-full border border-white/30 transition-colors duration-300"
	></div>
</div>

<style>
	.custom-cursor,
	.custom-cursor-outer {
		will-change: transform;
	}
</style>
