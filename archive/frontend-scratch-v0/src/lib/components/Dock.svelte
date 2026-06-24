<script lang="ts">
	import { wm } from '$lib/stores/windows.svelte';
	import { apps } from '$lib/apps';

	const BASE = 52; // tamaño base del icono
	const MAX = 36; // crecimiento máximo
	const RANGE = 110; // radio de influencia del cursor

	let mouseX = $state<number | null>(null);
	let dock: HTMLElement;
	let centers = $state<number[]>([]);

	function measure() {
		if (!dock) return;
		centers = [...dock.querySelectorAll<HTMLElement>('.item')].map((el) => {
			const r = el.getBoundingClientRect();
			return r.left + r.width / 2;
		});
	}

	function sizeFor(i: number): number {
		if (mouseX === null || !centers[i]) return BASE;
		const dist = Math.abs(mouseX - centers[i]);
		if (dist > RANGE) return BASE;
		const t = 1 - dist / RANGE;
		return BASE + MAX * t * t;
	}

	function onMove(e: PointerEvent) {
		if (centers.length === 0) measure();
		mouseX = e.clientX;
	}
</script>

<nav
	class="dock"
	bind:this={dock}
	onpointermove={onMove}
	onpointerleave={() => (mouseX = null)}
	aria-label="Dock"
>
	{#each apps as app, i}
		{#if app.dividerBefore}
			<span class="divider"></span>
		{/if}
		<button
			class="item"
			style="--size: {sizeFor(i)}px"
			title={app.name}
			aria-label={app.name}
			onclick={() => wm.open(app.id, app.name)}
		>
			<span class="tip">{app.name}</span>
			<img class="icon" src={app.icon} alt={app.name} draggable="false" />
			<span class="dot" class:on={wm.openApps.has(app.id)}></span>
		</button>
	{/each}
</nav>

<style>
	.dock {
		position: fixed;
		bottom: 10px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: flex-end;
		gap: 6px;
		padding: 8px 12px;
		background: var(--dock-bg);
		backdrop-filter: var(--blur-panel);
		-webkit-backdrop-filter: var(--blur-panel);
		border: 1px solid var(--border);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-dock);
		z-index: 900;
	}

	.item {
		position: relative;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		display: flex;
		align-items: flex-end;
		transition: width var(--dur-fast) var(--ease-out);
	}

	.icon {
		width: var(--size);
		height: var(--size);
		object-fit: contain;
		filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.28));
		transition:
			width var(--dur-fast) var(--ease-out),
			height var(--dur-fast) var(--ease-out);
	}

	.divider {
		width: 1px;
		align-self: stretch;
		margin: 6px 4px;
		background: var(--border);
	}

	.tip {
		position: absolute;
		bottom: calc(var(--size) + 12px);
		left: 50%;
		transform: translateX(-50%) scale(0.9);
		padding: 4px 10px;
		background: var(--surface-strong);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		white-space: nowrap;
		box-shadow: var(--shadow-md);
		opacity: 0;
		pointer-events: none;
		transition:
			opacity var(--dur-fast) var(--ease-out),
			transform var(--dur-fast) var(--ease-spring);
	}

	.item:hover .tip {
		opacity: 1;
		transform: translateX(-50%) scale(1);
	}

	.dot {
		position: absolute;
		bottom: -5px;
		left: 50%;
		transform: translateX(-50%);
		width: 4px;
		height: 4px;
		border-radius: var(--radius-full);
		background: var(--text);
		opacity: 0;
		transition: opacity var(--dur-fast) var(--ease-out);
	}
	.dot.on {
		opacity: 0.6;
	}
</style>
