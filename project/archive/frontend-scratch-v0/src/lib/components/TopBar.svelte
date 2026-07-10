<script lang="ts">
	import { onMount } from 'svelte';

	let {
		onToggleTheme,
		onOpenSpotlight
	}: { onToggleTheme: () => void; onOpenSpotlight: () => void } = $props();

	let now = $state(new Date());

	onMount(() => {
		const id = setInterval(() => (now = new Date()), 1000);
		return () => clearInterval(id);
	});

	const fmtTime = (d: Date) =>
		d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
	const fmtDate = (d: Date) =>
		d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });

	const menus = ['Archivo', 'Edición', 'Ver', 'Ventana', 'Ayuda'];
</script>

<header class="bar">
	<div class="left">
		<button class="logo" aria-label="Menú ArchMac"></button>
		<span class="app">ArchMac</span>
		{#each menus as m}
			<button class="menu">{m}</button>
		{/each}
	</div>

	<div class="right">
		<button class="icon" onclick={onOpenSpotlight} aria-label="Spotlight">⌕</button>
		<button class="icon" onclick={onToggleTheme} aria-label="Cambiar tema">◐</button>
		<span class="status">{fmtDate(now)}</span>
		<span class="status time">{fmtTime(now)}</span>
	</div>
</header>

<style>
	.bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--space-3);
		background: var(--bar-bg);
		backdrop-filter: var(--blur-bar);
		-webkit-backdrop-filter: var(--blur-bar);
		border-bottom: 1px solid var(--border);
		font-size: var(--text-sm);
		z-index: 1000;
	}

	.left,
	.right {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.logo {
		width: 14px;
		height: 14px;
		border-radius: var(--radius-full);
		background: linear-gradient(135deg, var(--accent), var(--accent-hover));
		border: none;
		cursor: pointer;
		box-shadow: var(--shadow-sm);
	}

	.app {
		font-weight: var(--weight-bold);
	}

	.menu {
		background: none;
		border: none;
		color: var(--text);
		font: inherit;
		cursor: pointer;
		opacity: 0.85;
		padding: 2px 4px;
		border-radius: var(--radius-sm);
		transition: background var(--dur-fast) var(--ease-out);
	}
	.menu:hover {
		background: var(--surface);
	}

	.icon {
		background: none;
		border: none;
		color: var(--text);
		cursor: pointer;
		font-size: var(--text-md);
		line-height: 1;
	}

	.status {
		font-weight: var(--weight-medium);
	}
	.time {
		font-variant-numeric: tabular-nums;
	}
</style>
