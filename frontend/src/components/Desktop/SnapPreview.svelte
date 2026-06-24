<script lang="ts">
	import { snap } from '$lib/state/snap.svelte.ts';
</script>

{#if snap.zone}
	<div
		class="snap-preview"
		style:left="{snap.zone.x}px"
		style:top="{snap.zone.y}px"
		style:width="{snap.zone.w}px"
		style:height="{snap.zone.h}px"
	></div>
{/if}

<style>
	.snap-preview {
		position: fixed;
		z-index: 50;

		border-radius: 0.6rem;
		margin: 6px;
		box-sizing: border-box;

		background: hsla(0, 0%, 100%, 0.18);
		backdrop-filter: blur(8px) saturate(140%);
		border: 1.5px solid hsla(0, 0%, 100%, 0.5);
		box-shadow: 0 8px 30px hsla(0, 0%, 0%, 0.25);

		/* anchos/altos ya incluyen el margen de 6px via box-sizing + margin */
		pointer-events: none;
		animation: snap-in 0.12s ease-out;
	}

	@keyframes snap-in {
		from {
			opacity: 0;
			transform: scale(0.97);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
