<script>
	import Dock from '../Dock/Dock.svelte';
	import TopBar from '../TopBar/TopBar.svelte';
	import Wallpaper from '../apps/WallpaperApp/Wallpaper.svelte';
	import AppSwitcher from './AppSwitcher.svelte';
	import BootupScreen from './BootupScreen.svelte';
	import ContextMenu from './ContextMenu.svelte';
	import Launchpad from './Launchpad.svelte';
	import Spotlight from './Spotlight.svelte';
	import SnapPreview from './SnapPreview.svelte';
	import SystemUpdate from './SystemUpdate.svelte';
	import WindowsArea from './Window/WindowsArea.svelte';
	import { system } from '$lib/state/system.svelte.ts';
	import { switcher_advance, switcher_cancel, switcher_commit } from '$lib/state/switcher.svelte.ts';

	const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

	if (!isMac) {
		Promise.all([
			import('@fontsource/inter/latin-ext-300.css'),
			import('@fontsource/inter/latin-ext-400.css'),
			import('@fontsource/inter/latin-ext-500.css'),
			import('@fontsource/inter/latin-ext-600.css'),
		]);
	}
	/** @type {HTMLElement} */
	let mainEl;

	/** @param {KeyboardEvent} e */
	function onKeyDown(e) {
		const mod = e.metaKey || e.ctrlKey;

		// ⌘/Ctrl + Espacio → Spotlight
		if (mod && e.code === 'Space') {
			e.preventDefault();
			system.spotlight_open = !system.spotlight_open;
			return;
		}

		// ⌘/Ctrl + Tab → cambiador de apps (Shift = sentido inverso)
		if (mod && e.key === 'Tab') {
			e.preventDefault();
			switcher_advance(e.shiftKey ? -1 : 1);
			return;
		}

		// F4 → Launchpad
		if (e.key === 'F4') {
			e.preventDefault();
			system.launchpad_open = !system.launchpad_open;
			return;
		}

		if (e.key === 'Escape') {
			if (system.switcher_open) switcher_cancel();
			system.spotlight_open = false;
			system.launchpad_open = false;
		}
	}

	/** @param {KeyboardEvent} e */
	function onKeyUp(e) {
		// Al soltar la tecla modificadora, se confirma el cambiador (estilo ⌘+Tab).
		if ((e.key === 'Meta' || e.key === 'Control') && system.switcher_open) {
			switcher_commit();
		}
	}

	let swipe_cooldown = false;
	/** @param {WheelEvent} e */
	function onWheel(e) {
		// Swipe horizontal sobre el escritorio = cambiar entre ventanas (simula 3 dedos ↔).
		if (Math.abs(e.deltaX) < 40 || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
		const target = /** @type {HTMLElement} */ (e.target);
		if (target?.closest?.('#windows-area .container')) return; // no robar el scroll de las apps
		if (swipe_cooldown) return;
		swipe_cooldown = true;
		setTimeout(() => (swipe_cooldown = false), 350);
		switcher_advance(e.deltaX > 0 ? 1 : -1);
	}
</script>

<svelte:window onkeydown={onKeyDown} onkeyup={onKeyUp} onwheel={onWheel} />

<div bind:this={mainEl} class="container">
	<main>
		<TopBar />
		<WindowsArea />
		<Dock />
	</main>

	<Wallpaper />
	<BootupScreen />
	<SystemUpdate />

	<SnapPreview />
	<Spotlight />
	<Launchpad />
	<AppSwitcher />

	<ContextMenu target_element={mainEl} />
</div>

<style>
	.container {
		height: 100%;
		width: 100%;
	}

	main {
		height: 100%;
		width: 100%;

		display: grid;
		grid-template-rows: auto 1fr auto;
	}
</style>
