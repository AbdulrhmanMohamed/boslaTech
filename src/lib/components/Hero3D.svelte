<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { ContactShadows, Float } from '@threlte/extras';
	import { getContext, onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import * as THREE from 'three';
	import { theme } from '$lib/stores/theme.svelte';
	import { base } from '$app/paths';
	import Hero3DLogo from './Hero3DLogo.svelte';

	const mouse = getContext<{ x: number; y: number }>('mouse');
	const currentTheme = $derived(theme.current);

	let {
		sceneRotation = 0,
		sceneRotationX = 0,
		sceneRotationZ = 0,
		scenePosition = [0, 0, 0] as [number, number, number],
		sceneScale = 1,
		ecosystemOpacity = 1
	} = $props();

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

	// Mobile-specific orbit radii - tighter for portrait view, only 20 logos
	const desktopOrbitRadii = [4.5, 6.0, 7.5, 9.0, 10.5, 12.0];
	const mobileOrbitRadii = [2.2, 3.5]; // 2 rings for 20 logos

	let isMobile = $state(false);
	let currentLayer = $state(0);
	let visibleCount = $state(0);
	let showWireframe = $state(false);
	let showGrid = $state(false);
	let showRings = $state(false);
	let showLogos = $state(false);
	let showDataThreads = $state(false);
	let isFullyLoaded = $state(false);

	// Mobile-specific 3D adjustments
	const orbitRadii = $derived(isMobile ? mobileOrbitRadii : desktopOrbitRadii);
	const logosPerOrbit = $derived(Math.ceil(clientLogos.length / orbitRadii.length));
	// Mobile: sphere 1.5x logo size (logo=0.5, sphere=0.75), Desktop: standard
	const logoSize = $derived(isMobile ? 0.5 : 0.32);
	const sphereScale = $derived(isMobile ? 0.75 : 1.0); // 1.5x logo size
	const ringOpacity = $derived(isMobile ? 0.6 : 0.4);

	onMount(() => {
		isMobile = window.innerWidth < 768;

		const mobileMaxLogos = 20;
		const layerTimings = isMobile
			? { core: 0, wireframe: 200, grid: 400, rings: 500, logos: 600, threads: 700, maxLayer: 3 }
			: { core: 0, wireframe: 300, grid: 500, rings: 700, logos: 900, threads: 1100, maxLayer: 6 };

		setTimeout(() => {
			currentLayer = 1;
			visibleCount = isMobile ? mobileMaxLogos : 6;
			showWireframe = true;
		}, layerTimings.wireframe);

		setTimeout(() => {
			currentLayer = 2;
			showGrid = true;
		}, layerTimings.grid);

		setTimeout(() => {
			currentLayer = 3;
			showRings = true;
		}, layerTimings.rings);

		setTimeout(() => {
			currentLayer = 4;
			showLogos = true;
		}, layerTimings.logos);

		setTimeout(() => {
			currentLayer = 5;
			showDataThreads = true;
		}, layerTimings.threads);

		setTimeout(() => {
			currentLayer = layerTimings.maxLayer;
			isFullyLoaded = true;
		}, layerTimings.threads + 500);

		// On mobile, show all 20 logos at once (no progressive loading needed)
		// On desktop, load in batches
		if (!isMobile) {
			const loadNextBatch = () => {
				if (visibleCount < clientLogos.length) {
					const increment = 3;
					visibleCount = Math.min(visibleCount + increment, clientLogos.length);

					if (visibleCount < clientLogos.length) {
						if ('requestIdleCallback' in window) {
							(
								requestIdleCallback as (
									cb: IdleRequestCallback,
									opts?: IdleRequestOptions
								) => number
							)(() => setTimeout(loadNextBatch, 200), { timeout: 300 });
						} else {
							setTimeout(loadNextBatch, 200);
						}
					}
				}
			};

			setTimeout(loadNextBatch, layerTimings.logos + 500);
		}
	});

	const visibleLogos = $derived(
		clientLogos.slice(0, isMobile ? 20 : clientLogos.length).slice(0, visibleCount)
	);
	const ringVisibility = $derived(theme.current === 'dark' ? 0.8 : 0.4);
	const threadIntensity = $derived(theme.current === 'dark' ? 4.0 : 1.8);
	const threadOpacity = $derived(theme.current === 'dark' ? 0.6 : 0.3);
	const coreIntensity = $derived(theme.current === 'dark' ? 5.0 : 2.5);

	const rotationX = spring(0, { stiffness: 0.05, damping: 0.3 });
	const rotationY = spring(0, { stiffness: 0.05, damping: 0.3 });
	const scale = spring(1, { stiffness: 0.1, damping: 0.4 });

	const segmentCount = $derived(isMobile ? 16 : 24);
	const sphereRadius = $derived(isMobile ? 0.7 : 1.1);
	const coreSphereGeometry = $derived(
		new THREE.SphereGeometry(sphereRadius, segmentCount, segmentCount)
	);
	const clientPaneGeometry = $derived(new THREE.CircleGeometry(logoSize, isMobile ? 12 : 16));
	const wireframeSphereGeometry = $derived(
		new THREE.SphereGeometry(sphereRadius * 1.1, segmentCount, segmentCount)
	);

	let lastMouseX = 0;
	let lastMouseY = 0;
	const MOUSE_THRESHOLD = 0.005;
	let time = $state(0);

	const FRAME_SKIP = $derived(isMobile ? 3 : 2);
	let frameSkipCounter = 0;

	useTask((delta) => {
		frameSkipCounter++;
		if (frameSkipCounter % FRAME_SKIP !== 0) return;

		time += delta;
		const targetX = (mouse.y / window.innerHeight - 0.5) * 0.3;
		const targetY = (mouse.x / window.innerWidth - 0.5) * 0.3;

		if (
			Math.abs(targetX - lastMouseX) > MOUSE_THRESHOLD ||
			Math.abs(targetY - lastMouseY) > MOUSE_THRESHOLD
		) {
			lastMouseX = targetX;
			lastMouseY = targetY;
			rotationX.set(targetX);
			rotationY.set(targetY);
		}
	});
</script>

<T.AmbientLight intensity={currentTheme === 'dark' ? 0.6 : 1.0} />
<T.PointLight
	position={[0, 0, 0]}
	intensity={currentTheme === 'dark' ? 60 : 40}
	color={CORE_GLOW}
	distance={15}
	decay={2}
/>
{#if currentLayer >= 2}
	<T.PointLight
		position={[-5, 3, 5]}
		intensity={currentTheme === 'dark' ? 40 : 30}
		color={PURE_BLUE}
	/>
{/if}

<Float speed={1.0} rotationIntensity={0.15} floatIntensity={0.2}>
	<T.Group
		position={scenePosition}
		rotation.y={$rotationY + sceneRotation}
		rotation.x={$rotationX + sceneRotationX}
		rotation.z={sceneRotationZ}
		scale={$scale * sceneScale * sphereScale}
	>
		<T.Mesh geometry={coreSphereGeometry}>
			<T.MeshStandardMaterial
				color={PURE_BLUE}
				emissive={CORE_GLOW}
				emissiveIntensity={currentTheme === 'dark' ? 2.5 : 1.5}
				roughness={0.1}
				metalness={0.9}
			/>
		</T.Mesh>

		{#if showWireframe}
			<T.Mesh geometry={wireframeSphereGeometry} rotation.y={time * 0.3}>
				<T.MeshStandardMaterial
					color={PURE_ORANGE}
					emissive={PURE_ORANGE}
					emissiveIntensity={currentTheme === 'dark' ? 3.0 : 2.0}
					wireframe
					transparent
					opacity={currentTheme === 'dark'
						? 0.85 + Math.sin(time * 1.5) * 0.1
						: 0.65 + Math.sin(time * 1.5) * 0.05}
				/>
			</T.Mesh>
		{/if}

		{#if showGrid}
			<T.Mesh scale={1.02}>
				<T.SphereGeometry args={[sphereRadius * 1.01, segmentCount, segmentCount]} />
				<T.MeshStandardMaterial
					color={PURE_BLUE}
					emissive={PURE_BLUE}
					emissiveIntensity={currentTheme === 'dark' ? 1.2 : 0.8}
					wireframe
					transparent
					opacity={currentTheme === 'dark' ? 0.5 : 0.35}
				/>
			</T.Mesh>
		{/if}

		{#if showRings}
			{#each orbitRadii as radius, i}
				{#if !isMobile || i < 2}
					<T.Mesh rotation.x={Math.PI / 2 + i * 0.15}>
						<T.TorusGeometry args={[radius, 0.025, 16, 100]} />
						<T.MeshStandardMaterial
							color={PURE_BLUE}
							emissive={PURE_BLUE}
							emissiveIntensity={currentTheme === 'dark' ? 1.5 : 1.0}
							transparent
							opacity={ringOpacity * ecosystemOpacity}
						/>
					</T.Mesh>
				{/if}
			{/each}
		{/if}

		{#if showLogos}
			{#each visibleLogos as logoUrl, i}
				{@const orbitIndex = Math.floor(i / logosPerOrbit)}
				{@const radius = orbitRadii[orbitIndex]}
				{@const angleOffset = (i % logosPerOrbit) * ((Math.PI * 2) / logosPerOrbit)}
				{@const angle = angleOffset + time * (0.05 + orbitIndex * 0.02)}

				{@const xPos = Math.cos(angle) * radius}
				{@const zPos = Math.sin(angle) * radius}
				{@const yPos = Math.sin(time * 0.5 + i) * 0.15}

				{#if showDataThreads}
					<T.Group>
						<T.Mesh
							position={[xPos / 2, yPos / 2, zPos / 2]}
							rotation.y={-angle}
							rotation.z={Math.PI / 2}
						>
							<T.CylinderGeometry args={[0.008, 0.008, radius, 8]} />
							<T.MeshStandardMaterial
								color={PURE_BLUE}
								emissive={PURE_BLUE}
								emissiveIntensity={currentTheme === 'dark' ? 4.0 : 2.5}
								transparent
								opacity={(currentTheme === 'dark' ? 0.6 : 0.4) * ecosystemOpacity}
							/>
						</T.Mesh>
					</T.Group>
				{/if}

				<Hero3DLogo url={logoUrl} position={[xPos, yPos, zPos]} {ecosystemOpacity} {logoSize} />
			{/each}
		{/if}
	</T.Group>
</Float>

{#if currentLayer >= 3}
	<ContactShadows
		position={[0, -5, 0]}
		opacity={currentTheme === 'dark' ? 0.5 : 0.2}
		scale={22}
		blur={3}
		far={10}
		resolution={isMobile ? 64 : 128}
		frames={1}
		color={currentTheme === 'dark' ? PURE_BLUE : '#050505'}
	/>
{/if}
