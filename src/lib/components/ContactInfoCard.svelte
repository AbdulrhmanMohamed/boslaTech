<script lang="ts">
	import { Phone } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	let { data } = $props();

	const phoneLabel = data?.about?.phone?.label || (data?.lang === 'ar' ? 'الهاتف' : 'Phone');
	const phoneValue = data?.about?.phone?.value || '+20 111 2419980';

	let card: HTMLElement;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		// Entrance Animation
		gsap.fromTo(
			card,
			{ opacity: 0, y: 50, scale: 0.95, filter: 'blur(10px)' },
			{
				opacity: 1,
				y: 0,
				scale: 1,
				filter: 'blur(0px)',
				duration: 1.2,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: card,
					start: 'top 90%',
					end: 'top 20%',
					scrub: 1
				}
			}
		);

		// Magnetic Effect
		const xTo = gsap.quickTo(card, 'x', { duration: 0.6, ease: 'power2.out' });
		const yTo = gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power2.out' });
		const rotateX = gsap.quickTo(card, 'rotateX', { duration: 0.6, ease: 'power2.out' });
		const rotateY = gsap.quickTo(card, 'rotateY', { duration: 0.6, ease: 'power2.out' });

		const handleMouseMove = (e: MouseEvent) => {
			const rect = card.getBoundingClientRect();
			const x = e.clientX - rect.left - rect.width / 2;
			const y = e.clientY - rect.top - rect.height / 2;

			xTo(x * 0.05);
			yTo(y * 0.05);
			rotateX(-y * 0.02);
			rotateY(x * 0.02);
		};

		const handleMouseLeave = () => {
			xTo(0);
			yTo(0);
			rotateX(0);
			rotateY(0);
		};

		card.addEventListener('mousemove', handleMouseMove);
		card.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			card.removeEventListener('mousemove', handleMouseMove);
			card.removeEventListener('mouseleave', handleMouseLeave);
			// Kill ScrollTrigger instance related to this card to prevent memory leaks
			ScrollTrigger.getAll().forEach((t) => {
				if (t.trigger === card) t.kill();
			});
		};
	});
</script>

<div
	bind:this={card}
	class="cinematic-glass group relative overflow-hidden rounded-[3rem] border border-[var(--glass-border)] p-10 perspective-[1000px]"
>
	<div
		class="absolute top-0 right-0 -rotate-12 p-8 opacity-5 transition-transform duration-700 group-hover:rotate-0"
	>
		<Phone class="h-40 w-40" />
	</div>
	<div class="relative z-10 space-y-8">
		<h4 class="flex items-center gap-4 text-2xl font-black text-[var(--color-text-base)]">
			<span class="h-1.5 w-10 rounded-full bg-brand-orange"></span>
			{#if data?.lang === 'ar'}
				معلومات التواصل
			{:else}
				Contact <span class="text-brand-orange">Information</span>
			{/if}
		</h4>
		<div class="grid gap-8 sm:grid-cols-2">
			<div class="group/item flex items-center gap-5">
				<div
					class="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--glass-border)] bg-[var(--color-text-base)]/5 transition-colors group-hover/item:border-brand-blue/50"
				>
					<Phone class="h-7 w-7 text-brand-blue" />
				</div>
				<div>
					<div
						class="text-[10px] font-black tracking-widest text-[var(--color-text-muted)] uppercase"
					>
						{phoneLabel}
					</div>
					<a
						href="https://wa.me/201112419980?text=%D9%83%D9%86%D8%AA%20%D8%B9%D8%A7%D9%8A%D8%B2%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%B1%20%D8%B9%D9%86%20%D8%AA%D9%81%D8%A7%D8%B5%D9%8A%D9%84%20%D8%AA%D8%B5%D9%85%D9%8A%D9%85%20%D8%A7%D9%84%D9%85%D9%88%D9%82%D8%B9"
						target="_blank"
						rel="noopener noreferrer"
						class="text-xl font-black text-[var(--color-text-base)] transition-colors hover:text-brand-blue"
					>
						<span dir="ltr">{phoneValue}</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
