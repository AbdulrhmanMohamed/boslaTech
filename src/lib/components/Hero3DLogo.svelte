<script lang="ts">
	import { T, useLoader } from '@threlte/core';
	import { Billboard } from '@threlte/extras';
	import * as THREE from 'three';
	import { theme } from '$lib/stores/theme.svelte';

	let { url, position, ecosystemOpacity, logoSize = 0.32 } = $props();
	const currentTheme = $derived(theme.current);

	const clientPaneGeometry = new THREE.CircleGeometry(logoSize, 12);

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
</script>

<Billboard {position}>
	{#await texture then t}
		{#if t}
			<T.Mesh geometry={clientPaneGeometry}>
				<T.MeshBasicMaterial
					map={t}
					transparent
					opacity={0.98 * ecosystemOpacity}
					side={THREE.DoubleSide}
					toneMapped={false}
				/>
			</T.Mesh>

			<T.Mesh scale={1.15}>
				<T.RingGeometry args={[logoSize, logoSize * 1.1, 12]} />
				<T.MeshStandardMaterial
					color={PURE_BLUE}
					emissive={PURE_BLUE}
					emissiveIntensity={currentTheme === 'dark' ? 2.5 : 1.5}
					transparent
					opacity={(currentTheme === 'dark' ? 0.9 : 0.6) * ecosystemOpacity}
					side={THREE.DoubleSide}
				/>
			</T.Mesh>
		{/if}
	{/await}
</Billboard>
