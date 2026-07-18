<script lang="ts">
	import { T, useTask, useScheduler } from '@threlte/core';
	import { ContactShadows, Float, useCursor } from '@threlte/extras';
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

	// --- MEANINGFUL CONNECTIVITY SPHERE (Global Reach & Tech) ---

	// 1. Core Sphere (The Hub)
	const coreGeometry = new THREE.IcosahedronGeometry(1.8, 1);

	// 2. Wireframe (The Network) - We'll use this with a wireframe material or EdgesGeometry

	// 3. Data Particles (Messages/Signals)
	const particleCount = 8;
	const particlePositions = Array.from({ length: particleCount }, (_, i) => {
		const phi = Math.acos(-1 + (2 * i) / particleCount);
		const theta = Math.sqrt(particleCount * Math.PI) * phi;
		return {
			x: 3 * Math.cos(theta) * Math.sin(phi),
			y: 3 * Math.sin(theta) * Math.sin(phi),
			z: 3 * Math.cos(phi),
			speed: 0.5 + Math.random() * 0.5,
			offset: Math.random() * Math.PI * 2
		};
	});

	// Colors
	const PURE_BLUE = '#0b9dd9';
	const PURE_ORANGE = '#fb6220';

	// Theme-aware values
	const lightIntensity = $derived(currentTheme === 'light' ? 1.5 : 2);
	const ambientIntensity = $derived(currentTheme === 'light' ? 0.7 : 0.4);
	const emissiveIntensity = $derived(currentTheme === 'light' ? 0.4 : 0.8);
	const shadowOpacity = $derived(currentTheme === 'light' ? 0.2 : 0.4);

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
		// Dynamic rotation based on mouse
		const targetX =
			(mouse.y / (typeof window !== 'undefined' ? window.innerHeight : 1) - 0.5) * 0.4;
		const targetY = (mouse.x / (typeof window !== 'undefined' ? window.innerWidth : 1) - 0.5) * 0.4;
		rotationX.set(targetX);
		rotationY.set(targetY);
		scheduler.advance();
	}, { autoInvalidate: false });

	const { onPointerEnter, onPointerLeave } = useCursor('pointer');
</script>

<!-- High-End Lighting -->
<T.AmbientLight intensity={ambientIntensity} />
<T.DirectionalLight position={[10, 10, 10]} intensity={lightIntensity} color="#ffffff" />
<T.PointLight
	position={[-5, 3, 5]}
	intensity={currentTheme === 'light' ? 12 : 20}
	color={PURE_BLUE}
/>
<T.PointLight
	position={[5, -3, 5]}
	intensity={currentTheme === 'light' ? 10 : 15}
	color={PURE_ORANGE}
/>

<Float speed={2} rotationIntensity={0.4} floatIntensity={0.4}>
	<T.Group
		rotation.y={$rotationY + sceneRotation + time * 0.1}
		rotation.x={$rotationX}
		scale={$scale}
	>
		<!-- THE CONNECTIVITY SPHERE -->
		<T.Group onpointerenter={() => scale.set(1.1)} onpointerleave={() => scale.set(1)}>
			<!-- Inner Core (Solid, Glowing) -->
			<T.Mesh geometry={coreGeometry}>
				<T.MeshPhysicalMaterial
					color={PURE_BLUE}
					emissive={PURE_BLUE}
					{emissiveIntensity}
					roughness={0.2}
					metalness={0.8}
					clearcoat={1}
					clearcoatRoughness={0.1}
					transparent
					opacity={0.9}
					flatShading={true}
				/>
			</T.Mesh>

			<!-- Outer Network Shell (Wireframe) -->
			<T.Mesh scale={1.2}>
				<T.IcosahedronGeometry args={[1.8, 1]} />
				<T.MeshStandardMaterial
					color={PURE_ORANGE}
					emissive={PURE_ORANGE}
					emissiveIntensity={currentTheme === 'light' ? 0.5 : 1.5}
					wireframe
					transparent
					opacity={0.3}
				/>
			</T.Mesh>

			<!-- Orbiting Data Particles -->
			{#each particlePositions as pos, i}
				<T.Group rotation={[time * 0.2 + pos.offset, time * 0.3, 0]}>
					<T.Mesh position={[2.8, 0, 0]}>
						<T.SphereGeometry args={[0.12, 16, 16]} />
						<T.MeshStandardMaterial
							color={i % 2 === 0 ? PURE_ORANGE : PURE_BLUE}
							emissive={i % 2 === 0 ? PURE_ORANGE : PURE_BLUE}
							emissiveIntensity={2}
							toneMapped={false}
						/>
					</T.Mesh>
					<!-- Trail Line -->
					<T.Mesh rotation.z={Math.PI / 2} position={[2.8, 0, 0]}>
						<T.RingGeometry args={[2.75, 2.8, 32, 1, 0, Math.PI / 4]} />
						<T.MeshBasicMaterial
							color={i % 2 === 0 ? PURE_ORANGE : PURE_BLUE}
							transparent
							opacity={0.3}
							side={THREE.DoubleSide}
						/>
					</T.Mesh>
				</T.Group>
			{/each}

			<!-- Connecting Lines (Abstract Network) -->
			{#each Array(3) as _, i}
				<T.Mesh rotation={[time * 0.1 * (i + 1), time * 0.05, 0]}>
					<T.TorusGeometry args={[3.2 + i * 0.4, 0.02, 16, 100]} />
					<T.MeshBasicMaterial color={PURE_BLUE} transparent opacity={0.2 - i * 0.05} />
				</T.Mesh>
			{/each}
		</T.Group>
	</T.Group>
</Float>

<ContactShadows
	position={[0, -4.5, 0]}
	opacity={shadowOpacity}
	scale={14}
	blur={2}
	far={10}
	resolution={256}
	frames={1}
	color={currentTheme === 'light' ? '#000000' : PURE_BLUE}
/>
