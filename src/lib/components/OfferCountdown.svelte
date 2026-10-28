<script lang="ts">
	import { OFFER_DEADLINE } from '$lib/data/pricing';

	let { lang = 'ar' }: { lang?: 'ar' | 'en' } = $props();

	const deadline = new Date(OFFER_DEADLINE).getTime();

	let now = $state(Date.now());

	$effect(() => {
		if (typeof window === 'undefined') return;
		const timer = setInterval(() => {
			now = Date.now();
		}, 1000);
		return () => clearInterval(timer);
	});

	const remaining = $derived.by(() => {
		const diff = Math.max(0, deadline - now);
		const days = Math.floor(diff / 86_400_000);
		const hours = Math.floor((diff % 86_400_000) / 3_600_000);
		const minutes = Math.floor((diff % 3_600_000) / 60_000);
		const seconds = Math.floor((diff % 60_000) / 1000);
		return { days, hours, minutes, seconds };
	});

	const units = $derived([
		{ value: remaining.days, label: lang === 'ar' ? 'يوم' : 'Days' },
		{ value: remaining.hours, label: lang === 'ar' ? 'ساعة' : 'Hrs' },
		{ value: remaining.minutes, label: lang === 'ar' ? 'دقيقة' : 'Min' },
		{ value: remaining.seconds, label: lang === 'ar' ? 'ثانية' : 'Sec' }
	]);

	const pad = (n: number) => String(n).padStart(2, '0');
</script>

<div
	class="offer-countdown flex items-center justify-center gap-3 md:gap-5"
	aria-label={lang === 'ar' ? 'الوقت المتبقي للعرض' : 'Time remaining for the offer'}
>
	{#each units as unit, i (unit.label)}
		{#if i > 0}
			<span class="text-lg font-black text-brand-orange opacity-70">:</span>
		{/if}
		<div
			class="cinematic-glass flex min-w-[3.5rem] flex-col items-center rounded-xl border border-[var(--glass-border)] px-2 py-2 md:min-w-[4.5rem]"
		>
			<span class="text-xl font-black tabular-nums text-[var(--color-text-base)] md:text-2xl">
				{pad(unit.value)}
			</span>
			<span class="text-[10px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">
				{unit.label}
			</span>
		</div>
	{/each}
</div>
