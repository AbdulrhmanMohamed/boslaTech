<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import About3D from '$lib/components/Hero3D.svelte';

	let { sceneRotation, sceneRotationX, sceneRotationZ, scenePosition, sceneScale, ecosystemOpacity, onContextRestored, cameraPosition, cameraFov, canvasKey }: {
		sceneRotation: number;
		sceneRotationX: number;
		sceneRotationZ: number;
		scenePosition: [number, number, number];
		sceneScale: number;
		ecosystemOpacity: number;
		onContextRestored: () => void;
		cameraPosition: [number, number, number];
		cameraFov: number;
		canvasKey: number;
	} = $props();
</script>

<Canvas>
	<T.PerspectiveCamera makeDefault position={cameraPosition} fov={cameraFov} />
	{#key canvasKey}
		<About3D
			{sceneRotation}
			{sceneRotationX}
			{sceneRotationZ}
			{scenePosition}
			{sceneScale}
			{ecosystemOpacity}
			{onContextRestored}
		/>
	{/key}
</Canvas>
