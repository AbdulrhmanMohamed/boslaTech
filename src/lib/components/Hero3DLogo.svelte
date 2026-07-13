<script lang="ts">
	import { T, useLoader, useTask } from '@threlte/core';
	import { Billboard } from '@threlte/extras';
	import * as THREE from 'three';
	import { theme } from '$lib/stores/theme.svelte';

	let { url, position, ecosystemOpacity, logoSize = 0.32, isVisible = true } = $props();
	const currentTheme = $derived(theme.current);

	const logoWidth = 1.0;
	// Calculate height to maintain aspect ratio, assuming square logos for now or adjusting based on texture
	// For most logos, we want them centered.
	const logoHeight = 1.0;

	const clientPaneGeometry = new THREE.CircleGeometry(logoSize, 32);

	const safeUrl = encodeURI(url);
	const texture = useLoader(THREE.TextureLoader).load(safeUrl, {
		transform: (t) => {
			t.colorSpace = THREE.SRGBColorSpace;
			t.anisotropy = 4;
			t.needsUpdate = true;
			return t;
		}
	});

	const PURE_BLUE = '#0b9dd9';

	let time = 0;
	useTask((delta) => {
		if (!isVisible) return;
		time += delta;
	});
</script>

<Billboard {position}>
	{#await texture then t}
		{#if t}
			<T.Mesh geometry={clientPaneGeometry} scale={1 + Math.sin(time * 2) * 0.02}>
				<T.MeshBasicMaterial
					map={t}
					transparent
					opacity={(0.9 + Math.sin(time * 1.5) * 0.1) * ecosystemOpacity}
					side={THREE.DoubleSide}
					toneMapped={false}
				/>
			</T.Mesh>

			<T.Mesh scale={1.15 + Math.sin(time * 3) * 0.05}>
				<T.RingGeometry args={[logoSize, logoSize * 1.08, 32]} />
				<T.MeshStandardMaterial
					color={PURE_BLUE}
					emissive={PURE_BLUE}
					emissiveIntensity={(currentTheme === 'dark' ? 3.0 : 2.0) + Math.sin(time * 4) * 1.5}
					transparent
					opacity={(currentTheme === 'dark' ? 0.8 : 0.5) * ecosystemOpacity}
					side={THREE.DoubleSide}
				/>
			</T.Mesh>
		{/if}
	{/await}
</Billboard>
