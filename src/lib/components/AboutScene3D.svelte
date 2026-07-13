<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import About3D from './Hero3D.svelte';

	let {
		cameraZoom = 7,
		sceneRotation = 0,
		sceneRotationX = 0,
		sceneRotationZ = 0,
		scenePosition = [0, 0, 0] as [number, number, number],
		sceneScale = 1,
		ecosystemOpacity = 1,
		scrollY = 0,
		cameraPosition = [0, 0, 10] as [number, number, number],
		cameraFov = 45,
		canvasKey = 0,
		onContextRestored
	} = $props();
</script>

<Canvas>
	<T.PerspectiveCamera makeDefault position={cameraPosition} fov={cameraFov} />
	{#key canvasKey}
		<About3D
			{cameraZoom}
			{sceneRotation}
			{sceneRotationX}
			{sceneRotationZ}
			{scenePosition}
			{sceneScale}
			{ecosystemOpacity}
			{scrollY}
			{onContextRestored}
		/>
	{/key}
</Canvas>
