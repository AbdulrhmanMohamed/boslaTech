<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Billboard } from '@threlte/extras';
	import * as THREE from 'three';

	let { url, size = 0.5 } = $props();

	const clientPaneGeometry = new THREE.CircleGeometry(size, 16);

	const PURE_BLUE = '#0b9dd9';

	let texture = $state<THREE.Texture | null>(null);
	let textureLoaded = $state(false);

	useTask(() => {
		if (textureLoaded) return;

		const loader = new THREE.TextureLoader();
		loader.load(encodeURI(url), (t) => {
			t.colorSpace = THREE.SRGBColorSpace;
			t.anisotropy = 4;
			t.needsUpdate = true;
			texture = t;
			textureLoaded = true;
		});
	});
</script>

<Billboard>
	{#if textureLoaded && texture}
		<T.Mesh geometry={clientPaneGeometry}>
			<T.MeshBasicMaterial
				map={texture}
				transparent
				opacity={0.95}
				side={THREE.DoubleSide}
				toneMapped={false}
			/>
		</T.Mesh>

		<T.Mesh scale={1.15}>
			<T.RingGeometry args={[size, size * 1.15, 16]} />
			<T.MeshStandardMaterial
				color={PURE_BLUE}
				emissive={PURE_BLUE}
				emissiveIntensity={1.5}
				transparent
				opacity={0.7}
				side={THREE.DoubleSide}
			/>
		</T.Mesh>
	{/if}
</Billboard>
