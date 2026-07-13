<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Float } from '@threlte/extras';
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import * as THREE from 'three';
	import { base } from '$app/paths';
	import HeroGalaxyLogo from './HeroGalaxyLogo.svelte';

	let { sceneRotation = 0, sceneRotationX = 0, ecosystemOpacity = 1 } = $props();

	const allClientLogos = [
		'498130912_4067457406834635_972587115347644993_n.webp',
		'8-02.webp',
		'8-03.webp',
		'8-04.webp',
		'8-05.webp',
		'8_2-03.webp',
		'8_2-04.webp',
		'8_2-05.webp',
		'DDA.webp',
		'Final Logo.webp',
		'Logo-dr-abeer.webp',
		'Ocean.webp',
		'Orchado-square.webp',
		'akhbrna-01.webp',
		'akyo-01.webp',
		'alemad.webp',
		'alexandria turm-01.webp',
		'alnowaisir-01.webp',
		'arabia kw-01.webp',
		'arabian1-01.webp',
		'aviation-logo.webp',
		'becoun.webp',
		'beta-01.webp',
		'book and go egypt.webp',
		'cosmoeve-01.webp',
		'dot help nation.webp',
		'dx-01.webp',
		'egy star.webp',
		'elmarwa.webp',
		'elwfaa trading.webp',
		'emdad pharma.webp',
		'excel ceutix.webp',
		'excel pharma.webp',
		'fashion styles-01.webp',
		'fpm-01.webp',
		'fug-01.webp',
		'grand mashreq-01.webp',
		'heroes lab.webp',
		'immigration.webp',
		'jawdda store.webp',
		'kepp.webp',
		'kl logo pc.webp',
		'lamoda.webp',
		'lasiesta-01.webp',
		'liquid-01.webp',
		'lumzug-01.webp',
		'mando.webp',
		'marfae.webp',
		'metex.webp',
		'modern decoration.webp',
		'moderntrans-01.webp',
		'new haven-01.webp',
		'nour-home.webp',
		'nsv.webp',
		'prettier.webp',
		'purewell-01.webp',
		'rlimo-01.webp',
		'snaf-01.webp',
		'techno graphic.webp',
		'top chimical group.webp',
		'tpad-01.webp',
		'weasy.webp',
		'yalla vape.webp',
		'بنك الدم-01.webp',
		'دكتور علاء-01.webp',
		'فيوتشر فيجن للتدريب-01.webp'
	];

	let clientLogos = allClientLogos.map((name) => `${base}/images/logos/${name}`);

	const PURE_BLUE = '#0b9dd9';
	const CORE_GLOW = '#0b9dd9';
	const PURE_ORANGE = '#fb6220';

	let isMobile = $state(false);
	let visibleCount = $state(0);

	const cols = 6;
	const rows = 4;
	const logoSize = 0.45;

	onMount(() => {
		isMobile = window.innerWidth < 768;

		setTimeout(() => {
			visibleCount = isMobile ? 18 : 24;
		}, 200);
	});

	const visibleLogos = $derived(clientLogos.slice(0, visibleCount));

	const rotationX = spring(0, { stiffness: 0.03, damping: 0.5 });
	const rotationY = spring(0, { stiffness: 0.03, damping: 0.5 });

	let time = $state(0);
	let scrollY = $state(0);

	onMount(() => {
		const handleScroll = () => {
			scrollY = window.scrollY;
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	useTask((delta) => {
		time += delta;

		if (typeof window === 'undefined') return;

		const mx = window.innerWidth / 2;
		const my = window.innerHeight / 2;

		const targetX = (my / window.innerHeight - 0.5) * 0.1 - scrollY * 0.0003;
		const targetY = (mx / window.innerWidth - 0.5) * 0.1;

		rotationX.set(targetX);
		rotationY.set(targetY);
	});
</script>

<T.AmbientLight intensity={1} />
<T.DirectionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
<T.PointLight position={[0, 0, 5]} intensity={60} color={CORE_GLOW} distance={20} decay={2} />

<Float speed={0.1} rotationIntensity={0.02} floatIntensity={0.05}>
	<T.Group
		rotation.y={$rotationY}
		rotation.x={$rotationX}
		scale={isMobile ? 0.7 : 1}
		position.y={isMobile ? 0.5 : 0}
	>
		{#each visibleLogos as logoUrl, i}
			{@const col = i % cols}
			{@const row = Math.floor(i / cols)}
			{@const xPos = (col - (cols - 1) / 2) * 1.2}
			{@const yPos = -(row - (rows - 1) / 2) * 1.2}
			{@const zPos = Math.sin(time + i * 0.3) * 0.2}

			<T.Group position={[xPos, yPos, zPos]}>
				<HeroGalaxyLogo url={logoUrl} size={logoSize} />
			</T.Group>
		{/each}
	</T.Group>
</Float>
