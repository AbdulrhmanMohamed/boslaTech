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

	onMount(() => {
		isMobile = window.innerWidth < 768;

		setTimeout(() => {
			visibleCount = isMobile ? 15 : 25;
		}, 300);
	});

	const visibleLogos = $derived(clientLogos.slice(0, visibleCount));

	const rotationX = spring(0, { stiffness: 0.02, damping: 0.4 });
	const rotationY = spring(0, { stiffness: 0.02, damping: 0.4 });

	const logoSize = 0.55;

	let time = $state(0);

	useTask((delta) => {
		time += delta;

		if (typeof window === 'undefined') return;

		const mx = window.innerWidth / 2;
		const my = window.innerHeight / 2;

		const targetX = (my / window.innerHeight - 0.5) * 0.1;
		const targetY = (mx / window.innerWidth - 0.5) * 0.1;

		rotationX.set(targetX);
		rotationY.set(targetY);
	});

	function getStreamPosition(index: number, total: number, t: number) {
		const speed = 0.5;
		const baseY = (index / total) * 8 - 4;
		const y = ((((baseY + t * speed) % 8) + 8) % 8) - 4;
		const x = Math.sin(index * 0.5 + t * 0.3) * 1.5;
		const z = Math.cos(index * 0.7 + t * 0.2) * 1;
		return { x, y, z };
	}
</script>

<T.AmbientLight intensity={0.8} />
<T.PointLight position={[0, 0, 0]} intensity={80} color={CORE_GLOW} distance={25} decay={2} />
<T.PointLight position={[-8, 4, 8]} intensity={50} color={PURE_BLUE} />
<T.PointLight position={[8, -4, 8]} intensity={40} color={PURE_ORANGE} />

<Float speed={0.1} rotationIntensity={0.02} floatIntensity={0.05}>
	<T.Group rotation.y={$rotationY} rotation.x={$rotationX} scale={isMobile ? 0.9 : 1}>
		{#each visibleLogos as logoUrl, i}
			{@const pos = getStreamPosition(i, visibleLogos.length, time)}
			{@const opacity = Math.max(0.3, 1 - Math.abs(pos.y) / 4)}
			{@const scale = 0.5 + opacity * 0.5}

			<T.Group position={[pos.x, pos.y, pos.z]} {scale}>
				<HeroGalaxyLogo url={logoUrl} size={logoSize} />
			</T.Group>

			{#if i > 0}
				{@const prevPos = getStreamPosition(i - 1, visibleLogos.length, time)}
				{@const midX = (pos.x + prevPos.x) / 2}
				{@const midY = (pos.y + prevPos.y) / 2}
				{@const midZ = (pos.z + prevPos.z) / 2}
				{@const dist = Math.sqrt(
					Math.pow(pos.x - prevPos.x, 2) +
						Math.pow(pos.y - prevPos.y, 2) +
						Math.pow(pos.z - prevPos.z, 2)
				)}
				{@const midOpacity = Math.min(opacity, Math.max(0.3, 1 - Math.abs(midY) / 4)) * 0.3}

				<T.Mesh position={[midX, midY, midZ]} lookAt={new THREE.Vector3(pos.x, pos.y, pos.z)}>
					<T.CylinderGeometry args={[0.008, 0.008, dist, 8]} />
					<T.MeshStandardMaterial
						color={PURE_BLUE}
						emissive={CORE_GLOW}
						emissiveIntensity={1}
						transparent
						opacity={midOpacity}
					/>
				</T.Mesh>
			{/if}
		{/each}
	</T.Group>
</Float>
