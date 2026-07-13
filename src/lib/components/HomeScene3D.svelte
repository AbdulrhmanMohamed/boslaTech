<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import Hero3D from './About3D.svelte';

	let {
		sceneRotation = 0,
		cameraPosition = [0, 0, 10] as [number, number, number],
		cameraFov = 45,
		canvasKey = 0,
		onContextRestored
	} = $props();
</script>

<Canvas>
	<T.PerspectiveCamera makeDefault position={cameraPosition} fov={cameraFov} />
	{#key canvasKey}
		<Hero3D {sceneRotation} {onContextRestored} />
	{/key}
</Canvas>
