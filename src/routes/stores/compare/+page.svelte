<script lang="ts">
	import { STORE_COMPARISON, STORE_PACKAGES, formatPrice } from '$lib/data/pricing';
	import { base } from '$app/paths';

	let { data }: { data: any } = $props();
	const lang = $derived((data?.lang || 'ar') as 'ar' | 'en');
	const isAr = $derived(lang === 'ar');

	const packages = $derived([
		{ id: 'store-standard', name: isAr ? 'المتجر الأساسي' : 'Basic Store', popular: false },
		{ id: 'store-pro', name: isAr ? 'المتجر الاحترافي' : 'Pro Store', popular: true },
		{ id: 'store-custom', name: isAr ? 'متجر مخصص' : 'Custom Store', popular: false }
	]);
</script>

<svelte:head>
	<title>{isAr ? 'مقارنة باقات المتاجر' : 'Store Packages Comparison'}</title>
</svelte:head>

<div class="relative" dir={isAr ? 'rtl' : 'ltr'}>
	<section class="relative overflow-hidden py-24 mt-12">
		<div class="container relative z-10 mx-auto px-6">
			<div class="mb-12 text-center">
				<h1 class="text-3xl font-black text-[var(--color-text-base)] md:text-5xl">
					{isAr ? 'مقارنة باقات المتاجر الإلكترونية' : 'Online Store Packages Comparison'}
				</h1>
				<p class="mt-4 text-[var(--color-text-muted)]">
					{isAr ? 'قارن بين الباقات واختر الأنسب لعملك.' : 'Compare the packages and pick the best fit for your business.'}
				</p>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full min-w-[640px] border-collapse text-sm">
					<thead>
						<tr>
							<th class="border border-[var(--glass-border)] bg-[var(--color-surface)] p-3 text-start font-black text-[var(--color-text-base)]">
								{isAr ? 'الميزة' : 'Feature'}
							</th>
							{#each packages as pkg}
								<th class="border border-[var(--glass-border)] bg-[var(--color-surface)] p-3 text-center font-black text-[var(--color-text-base)] {pkg.popular ? 'bg-brand-orange/10' : ''}">
									{pkg.name}
									{#if pkg.popular}
										<span class="ml-1 text-[10px] text-brand-orange">★</span>
									{/if}
								</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each STORE_COMPARISON as row}
							<tr>
								<td class="border border-[var(--glass-border)] p-3 font-medium text-[var(--color-text-base)]">
									{row.feature[lang]}
								</td>
								<td class="border border-[var(--glass-border)] p-3 text-center text-[var(--color-text-muted)]">{row.basic}</td>
								<td class="border border-[var(--glass-border)] p-3 text-center text-[var(--color-text-muted)] {row.pro === '✓' ? '' : ''}">{row.pro}</td>
								<td class="border border-[var(--glass-border)] p-3 text-center text-[var(--color-text-muted)]">{row.custom}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="mt-10 text-center">
				<a href={`${base}/stores`} class="btn-primary inline-flex">
					<span>{isAr ? 'العودة للمتاجر' : 'Back to Stores'}</span>
				</a>
			</div>
		</div>
	</section>
</div>
EOF
echo "created"