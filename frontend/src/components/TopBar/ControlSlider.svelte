<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		value = $bindable(0.5),
		label,
		icon,
	}: { value: number; label: string; icon: Snippet } = $props();

	let track = $state<HTMLElement>();
	let dragging = false;

	function setFromEvent(e: PointerEvent) {
		if (!track) return;
		const r = track.getBoundingClientRect();
		value = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
	}
	function down(e: PointerEvent) {
		dragging = true;
		track?.setPointerCapture(e.pointerId);
		setFromEvent(e);
	}
	function move(e: PointerEvent) {
		if (dragging) setFromEvent(e);
	}
	function up() {
		dragging = false;
	}
</script>

<div class="control-slider">
	<span class="label">{label}</span>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="track"
		bind:this={track}
		onpointerdown={down}
		onpointermove={move}
		onpointerup={up}
		role="slider"
		aria-label={label}
		aria-valuemin={0}
		aria-valuemax={100}
		aria-valuenow={Math.round(value * 100)}
		tabindex="0"
	>
		<div class="fill" style:width="{Math.max(10, value * 100)}%"></div>
		<span class="ico">{@render icon()}</span>
	</div>
</div>

<style>
	.control-slider {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		width: 100%;
	}
	.label {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--system-color-dark);
	}

	.track {
		position: relative;
		height: 1.7rem;
		border-radius: 50px;
		background: hsla(var(--system-color-dark-hsl), 0.18);
		overflow: hidden;
		cursor: pointer;
		touch-action: none;
		box-shadow: inset 0 0 0 0.5px hsla(var(--system-color-dark-hsl), 0.15);
	}
	.fill {
		position: absolute;
		inset: 0;
		width: 50%;
		background: #fff;
		border-radius: 50px;
		box-shadow: 0 0 2px hsla(0, 0%, 0%, 0.15);
	}
	.ico {
		position: absolute;
		left: 0.45rem;
		top: 50%;
		transform: translateY(-50%);

		display: grid;
		place-items: center;

		color: #3a3a3c;
	}
	.ico :global(svg) {
		font-size: 0.95rem;
	}
</style>
