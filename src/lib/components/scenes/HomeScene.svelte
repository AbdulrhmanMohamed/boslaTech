<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import Hero3D from '$lib/components/About3D.svelte';

	let { sceneRotation, onContextRestored, cameraPosition, cameraFov, canvasKey }: {
		sceneRotation: number;
		onContextRestored: () => void;
		cameraPosition: [number, number, number];
		cameraFov: number;
		canvasKey: number;
	} = $props();
</script>

<Canvas>
	<T.PerspectiveCamera makeDefault position={cameraPosition} fov={cameraFov} />
	{#key canvasKey}
		<Hero3D {sceneRotation} {onContextRestored} />
	{/key}
</Canvas>
