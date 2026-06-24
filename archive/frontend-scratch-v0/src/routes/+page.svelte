<script lang="ts">
	import TopBar from '$lib/components/TopBar.svelte';
	import Dock from '$lib/components/Dock.svelte';
	import Window from '$lib/components/Window.svelte';
	import Spotlight from '$lib/components/Spotlight.svelte';
	import { wm } from '$lib/stores/windows.svelte';

	let theme = $state<'light' | 'dark'>('light');
	let spotlightOpen = $state(false);

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		document.body.setAttribute('data-theme', theme);
	}

	function onKeydown(e: KeyboardEvent) {
		// ⌘+Espacio (mac) o Ctrl+Espacio (Windows/Linux) abre Spotlight.
		if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
			e.preventDefault();
			spotlightOpen = !spotlightOpen;
		}
	}
</script>

<svelte:window onkeydown={onKeydown} />

<main class="desktop">
	<TopBar onToggleTheme={toggleTheme} onOpenSpotlight={() => (spotlightOpen = true)} />

	<div class="welcome">
		<h1>ArchMac</h1>
		<p>Clic en el dock para abrir ventanas · ⌘/Ctrl + Espacio para Spotlight</p>
	</div>

	{#each wm.windows as win (win.id)}
		<Window {win} />
	{/each}

	<Dock />
	<Spotlight bind:open={spotlightOpen} />
</main>

<style>
	.desktop {
		position: relative;
		width: 100vw;
		height: 100vh;
		background: var(--bg-desktop);
		overflow: hidden;
		transition: background var(--dur-slow) var(--ease-out);
	}

	.welcome {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		color: var(--text);
	}

	.welcome h1 {
		font-size: 64px;
		font-weight: var(--weight-bold);
		letter-spacing: -2px;
	}

	.welcome p {
		font-size: var(--text-lg);
		margin-top: var(--space-2);
		color: var(--text-muted);
	}
</style>
