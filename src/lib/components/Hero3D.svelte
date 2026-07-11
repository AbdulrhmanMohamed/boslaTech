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
		ecosystemOpacity = 1,
		scrollY = 0, // Received from parent for scroll interactivity
		onContextRestored
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
	// Mobile: Single "Dynamic Orbital" - clean, elegant, limited logos
	const mobileOrbitRadii = [2.2];

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
	// Mobile: limit to 10 logos for a clean look
	const logosPerOrbit = $derived(isMobile ? 10 : Math.ceil(clientLogos.length / orbitRadii.length));
	// Mobile: standard logo size, but fewer of them
	const logoSize = $derived(isMobile ? 0.35 : 0.32);

	// Carousel logic for mobile (variables moved to loop scope or derived from frame loop)
	// We will calculate batch indices inside the render loop since 'time' is available there.

	const sphereScale = $derived(isMobile ? 0.8 : 1.0);
	const ringOpacity = $derived(isMobile ? 0.6 : 0.4);

	onMount(() => {
		isMobile = window.innerWidth < 768;

		// WebGL Context Loss Recovery
		const canvas = document.querySelector('canvas');
		if (canvas) {
			canvas.addEventListener('webglcontextlost', (event) => {
				event.preventDefault();
				console.warn('WebGL context lost. Attempting to recover...');
			});

			canvas.addEventListener('webglcontextrestored', () => {
				console.log('WebGL context restored.');
				// Force re-render by triggering a state update
				time = 0;
				// Notify parent to remount component
				if (onContextRestored) {
					onContextRestored();
				}
			});
		}

		// Reduced visible count for mobile (10 is enough for 2 clean rings)
		const mobileMaxLogos = 10;
		// Standard timing for both (Stable)
		const layerTimings = isMobile
			? { core: 0, wireframe: 300, grid: 500, rings: 700, logos: 900, threads: 1100, maxLayer: 3 }
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
	const sphereRadius = $derived(isMobile ? 0.85 : 1.1);
	const coreSphereGeometry = $derived(
		new THREE.SphereGeometry(sphereRadius, segmentCount, segmentCount)
	);
	const clientPaneGeometry = $derived(new THREE.CircleGeometry(logoSize, isMobile ? 12 : 16));
	const wireframeSphereGeometry = $derived(
		new THREE.SphereGeometry(sphereRadius * (isMobile ? 1.2 : 1.1), segmentCount, segmentCount)
	);

	// Particle Field
	const PARTICLE_COUNT = isMobile ? 50 : 150;
	const particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
		position: [
			(Math.random() - 0.5) * 20,
			(Math.random() - 0.5) * 20,
			(Math.random() - 0.5) * 10 - 5
		] as [number, number, number],
		scale: Math.random() * 0.5 + 0.2,
		speed: Math.random() * 0.2 + 0.1
	}));

	let lastMouseX = 0;
	let lastMouseY = 0;
	const MOUSE_THRESHOLD = 0.005;
	let time = $state(0);

	// Pulse for the core
	const corePulse = $derived(1 + Math.sin(time * 1.5) * 0.05);
	const atmospherePulse = $derived(1.1 + Math.sin(time * 1.0) * 0.08);

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
		rotation.x={isMobile ? $rotationX + sceneRotationX + 0.5 : $rotationX + sceneRotationX}
		rotation.z={sceneRotationZ}
		scale={$scale * sceneScale * sphereScale * (isMobile ? 1 + Math.sin(time * 0.8) * 0.03 : 1)}
	>
		<T.Mesh geometry={coreSphereGeometry} scale={corePulse}>
			<T.MeshStandardMaterial
				color={PURE_BLUE}
				emissive={CORE_GLOW}
				emissiveIntensity={currentTheme === 'dark' ? 3.5 : 2.5}
				roughness={0.1}
				metalness={0.9}
			/>
		</T.Mesh>

		<!-- Atmosphere Halo -->
		<T.Mesh geometry={coreSphereGeometry} scale={atmospherePulse}>
			<T.MeshStandardMaterial
				color={PURE_BLUE}
				emissive={PURE_BLUE}
				emissiveIntensity={currentTheme === 'dark' ? 1.0 : 0.5}
				transparent
				opacity={0.3}
				side={THREE.BackSide}
				depthWrite={false}
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
				{#if isMobile}
					<!-- Mobile Ring Logic: Fully aligned with Logos -->
					<T.Group
						rotation.x={0.5 + Math.sin(time * 0.5) * 0.2}
						rotation.z={Math.cos(time * 0.3) * 0.1}
						rotation.y={time * 0.15}
					>
						<!-- Rotate the torus by 90 degrees to lay flat in the tilted group -->
						<T.Mesh rotation.x={Math.PI / 2}>
							<T.TorusGeometry args={[radius, 0.025, 16, 100]} />
							<T.MeshStandardMaterial
								color={PURE_BLUE}
								emissive={PURE_BLUE}
								emissiveIntensity={currentTheme === 'dark' ? 1.5 : 1.0}
								transparent
								opacity={ringOpacity * ecosystemOpacity}
							/>
						</T.Mesh>
					</T.Group>
				{:else if i < 2}
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
			{#each orbitRadii as radius, i}
				{@const logoCount = logosPerOrbit}
				{@const startIndex = i * logoCount}
				{@const orbitLogos = clientLogos.slice(startIndex, startIndex + logoCount)}

				<T.Group
					rotation.x={isMobile
						? 0.5 + Math.sin(time * 0.5) * 0.2 // Dynamic "Wobble" - breathes up and down
						: Math.sin(time * 0.1 + i) * 0.1}
					rotation.z={isMobile ? Math.cos(time * 0.3) * 0.1 : Math.cos(time * 0.1 + i) * 0.05}
					rotation.y={isMobile ? time * 0.15 : 0}
				>
					{#each Array(logosPerOrbit) as _, j}
						<!-- Mobile Carousel Logic: Strict Batch Paging -->
						<!-- Total logos: clientLogos.length -->
						<!-- Logos per page: logosPerOrbit (10) -->
						<!-- We want to cycle through batches: 0-9, 10-19, 20-29, etc. -->
						<!-- Every 4 seconds, switch to the next batch. -->

						{@const carouselInterval = 4.0}
						{@const totalBatches = Math.ceil(clientLogos.length / logosPerOrbit)}

						<!-- Calculate which batch we are currently on -->
						{@const currentBatch = isMobile
							? Math.floor(time / carouselInterval) % totalBatches
							: 0}

						<!-- Transition progress within the 4s interval (0 to 1) -->
						{@const progress = (time % carouselInterval) / carouselInterval}

						<!-- Animation: 
							 Coin Flip Effect: Rotate X-axis multiple times.
							 No opacity fade (scale remains 1).
						-->
						{@const flipDuration = 2.0}
						<!-- Very smooth, slow spin -->
						{@const isFlipping = isMobile && progress < flipDuration / carouselInterval}

						<!-- Cubic Ease-In-Out Function for "Slow Start - Fast Middle - Slow End" -->
						{@const t = isFlipping ? progress / (flipDuration / carouselInterval) : 0}
						{@const easedT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2}

						<!-- Rotation: 0 -> 2*PI (360 degrees) during flip -->
						{@const flipAngle = isFlipping ? easedT * Math.PI * 2 : 0}

						<!-- 
							Mid-Flip Swap Logic:
							We must calculate the batch based on the flip progress.
							If we are in the FIRST HALF of the flip (easedT < 0.5), we show the OLD batch.
							If we are in the SECOND HALF (easedT >= 0.5), we show the NEW batch.
							This ensures the image changes exactly when the card is edge-on (90 or 270 deg).
						-->
						{@const effectiveBatch =
							isFlipping && easedT < 0.5
								? (currentBatch - 1 + totalBatches) % totalBatches // Show previous batch
								: currentBatch} // Show new batch

						{@const logoIndexRaw = j + effectiveBatch * logosPerOrbit}
						{@const logoIndex = isMobile ? logoIndexRaw % clientLogos.length : j + startIndex}

						{@const logoUrl = clientLogos[logoIndex]}

						<!-- No Opacity Fade - Solid physical flip -->
						{@const flipOpacity = 1}

						{@const angle = (j / logosPerOrbit) * Math.PI * 2}
						{@const xPos = Math.cos(angle) * radius}
						{@const zPos = Math.sin(angle) * radius}

						<!-- Y position is 0 to ensure logo center sits exactly on the orbit line -->
						<T.Group
							position={[xPos, 0, zPos]}
							rotation.x={flipAngle}
							scale={isMobile ? flipOpacity : 1}
						>
							{#key logoUrl}
								<Hero3DLogo url={logoUrl} position={[0, 0, 0]} {ecosystemOpacity} {logoSize} />
							{/key}
						</T.Group>

						{#if showDataThreads && !isMobile}
							<T.Group>
								<T.Mesh
									position={[xPos / 2, 0, zPos / 2]}
									rotation.y={-angle}
									rotation.z={Math.PI / 2}
								>
									<T.CylinderGeometry
										args={[0.008, 0.008, Math.sqrt(xPos * xPos + zPos * zPos), 8]}
									/>
									<T.MeshStandardMaterial
										color={PURE_BLUE}
										emissive={PURE_BLUE}
										emissiveIntensity={(currentTheme === 'dark' ? 5.0 : 3.0) +
											Math.sin(time * 3 + j) * 2}
										transparent
										opacity={(currentTheme === 'dark' ? 0.7 : 0.5) * ecosystemOpacity}
									/>
								</T.Mesh>
							</T.Group>
						{/if}
					{/each}
				</T.Group>
			{/each}
		{/if}

		<!-- Cinematic Particles -->
		<T.Group>
			{#each particles as p, i}
				<T.Mesh
					position={[
						p.position[0],
						p.position[1] + Math.sin(time * p.speed + i) * 0.5,
						p.position[2]
					]}
					scale={p.scale}
				>
					<T.SphereGeometry args={[0.02, 4, 4]} />
					<T.MeshBasicMaterial
						color={PURE_BLUE}
						transparent
						opacity={(0.3 + Math.sin(time * 2 + i) * 0.2) * ecosystemOpacity}
					/>
				</T.Mesh>
			{/each}
		</T.Group>
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
