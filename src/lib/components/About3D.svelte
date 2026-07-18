<script lang="ts">
	import { T, useTask, useScheduler } from '@threlte/core';
	import { ContactShadows, Float } from '@threlte/extras';
	import { getContext, onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import * as THREE from 'three';
	import { theme } from '$lib/stores/theme.svelte';

	const mouse = getContext<{ x: number; y: number }>('mouse') || { x: 0, y: 0 };

	// Props for external control
	let { cameraZoom = 7, sceneRotation = 0 } = $props();

	const currentTheme = $derived(theme.current);

	// Magnetic Physics: Spring-based rotation and scale
	const rotationX = spring(0, { stiffness: 0.05, damping: 0.3 });
	const rotationY = spring(0, { stiffness: 0.05, damping: 0.3 });
	const scale = spring(1, { stiffness: 0.1, damping: 0.4 });

	// Compass Geometry - Extremely relevant for "Bosla" (Compass in Arabic)
	const needleGeometry = new THREE.ConeGeometry(0.4, 2, 4); // Sharp needle
	const housingGeometry = new THREE.TorusGeometry(2.2, 0.05, 16, 100);
	const centerGeometry = new THREE.SphereGeometry(0.3, 32, 32);

	// Colors
	const PURE_BLUE = '#0b9dd9';
	const PURE_ORANGE = '#fb6220';

	// Theme-aware values
	const lightIntensity = $derived(currentTheme === 'light' ? 1.2 : 1.5);
	const ambientIntensity = $derived(currentTheme === 'light' ? 0.8 : 0.5);
	const emissiveIntensity = $derived(currentTheme === 'light' ? 0.2 : 0.5);
	const shadowOpacity = $derived(currentTheme === 'light' ? 0.2 : 0.3);
	const particleOpacity = $derived(currentTheme === 'light' ? 0.2 : 0.4);

	let isVisible = $state(true);

	onMount(() => {
		const canvas = document.querySelector('canvas');
		if (!canvas) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				isVisible = entry.isIntersecting;
			},
			{ threshold: 0 }
		);
		observer.observe(canvas);
		return () => observer.disconnect();
	});

	let time = $state(0);
	const scheduler = useScheduler();
	let renderBudget = 0;
	const BUDGET_MS = 4000;
	const EXTEND_MS = 2000;

	function extendRenderBudget(extraMs: number) {
		const now = performance.now();
		const newBudget = now + extraMs;
		if (newBudget > renderBudget) {
			renderBudget = newBudget;
			scheduler.advance();
		}
	}

	$effect(() => {
		if (isVisible) extendRenderBudget(BUDGET_MS);
	});

	function onMouseMoveForInvalidate() {
		if (!isVisible) return;
		extendRenderBudget(EXTEND_MS);
	}
	$effect(() => {
		if (typeof window === 'undefined') return;
		window.addEventListener('mousemove', onMouseMoveForInvalidate, { passive: true });
		return () => window.removeEventListener('mousemove', onMouseMoveForInvalidate);
	});

	useTask((delta) => {
		if (!isVisible) return;
		if (performance.now() > renderBudget) return;
		time += delta;
		// Follow mouse subtly
		const targetX =
			(mouse.y / (typeof window !== 'undefined' ? window.innerHeight : 1) - 0.5) * 0.4;
		const targetY = (mouse.x / (typeof window !== 'undefined' ? window.innerWidth : 1) - 0.5) * 0.4;
		rotationX.set(targetX);
		rotationY.set(targetY);
		scheduler.advance();
	}, { autoInvalidate: false });
</script>

<!-- High-End Lighting -->
<T.AmbientLight intensity={ambientIntensity} />
<T.DirectionalLight position={[10, 10, 10]} intensity={lightIntensity} color="#ffffff" />
<T.PointLight
	position={[-5, 3, 5]}
	intensity={currentTheme === 'light' ? 10 : 15}
	color={PURE_BLUE}
/>
<T.PointLight
	position={[5, -3, 5]}
	intensity={currentTheme === 'light' ? 8 : 10}
	color={PURE_ORANGE}
/>

<Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.3}>
	<T.Group
		rotation.y={$rotationY + sceneRotation + time * 0.05}
		rotation.x={$rotationX}
		scale={$scale}
	>
		<!-- COMPASS NEEDLE (The Brand Identity) -->
		<T.Group
			rotation.z={Math.sin(time * 0.5) * 0.5}
			onpointerenter={() => scale.set(1.15)}
			onpointerleave={() => scale.set(1)}
		>
			<!-- Top Half (Orange/North) -->
			<T.Mesh geometry={needleGeometry} position={[0, 1, 0]}>
				<T.MeshPhysicalMaterial
					color={PURE_ORANGE}
					emissive={PURE_ORANGE}
					{emissiveIntensity}
					roughness={0.1}
					metalness={0.9}
					clearcoat={1}
				/>
			</T.Mesh>

			<!-- Bottom Half (Blue/South) -->
			<T.Mesh geometry={needleGeometry} position={[0, -1, 0]} rotation.x={Math.PI}>
				<T.MeshPhysicalMaterial
					color={PURE_BLUE}
					emissive={PURE_BLUE}
					{emissiveIntensity}
					roughness={0.1}
					metalness={0.9}
					clearcoat={1}
				/>
			</T.Mesh>

			<!-- Center Pin -->
			<T.Mesh geometry={centerGeometry}>
				<T.MeshPhysicalMaterial
					color={currentTheme === 'light' ? '#cccccc' : '#ffffff'}
					roughness={0}
					metalness={1}
				/>
			</T.Mesh>
		</T.Group>

		<!-- Outer Housing Ring -->
		<T.Mesh geometry={housingGeometry} rotation.x={Math.PI / 2}>
			<T.MeshStandardMaterial
				color={PURE_BLUE}
				emissive={PURE_BLUE}
				emissiveIntensity={currentTheme === 'light' ? 0.4 : 0.8}
				transparent
				opacity={currentTheme === 'light' ? 0.2 : 0.3}
			/>
		</T.Mesh>

		<!-- Compass "Ticks" or Points -->
		{#each Array(4) as _, i}
			<T.Mesh position={[Math.cos((i * Math.PI) / 2) * 2.2, Math.sin((i * Math.PI) / 2) * 2.2, 0]}>
				<T.SphereGeometry args={[0.08, 16, 16]} />
				<T.MeshBasicMaterial color={PURE_ORANGE} />
			</T.Mesh>
		{/each}

		<!-- Floating Navigation Particles -->
		{#each Array(12) as _, i}
			{@const t = (i / 12) * Math.PI * 4 + time * 0.2}
			{@const r = 2.8}
			<T.Mesh position={[Math.cos(t) * r, Math.sin(t * 0.5) * 2, Math.sin(t) * r]}>
				<T.SphereGeometry args={[0.04, 8, 8]} />
				<T.MeshBasicMaterial color={PURE_BLUE} transparent opacity={particleOpacity} />
			</T.Mesh>
		{/each}
	</T.Group>
</Float>

<ContactShadows
	position={[0, -4, 0]}
	opacity={shadowOpacity}
	scale={12}
	blur={3}
	far={10}
	resolution={128}
	frames={1}
	color={currentTheme === 'light' ? '#000000' : PURE_ORANGE}
/>
