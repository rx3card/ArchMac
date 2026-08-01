<script lang="ts">
	import { wm, MIN_W, MIN_H, type WindowState } from '$lib/stores/windows.svelte';

	let { win }: { win: WindowState } = $props();

	let dragging = false;
	let startX = 0;
	let startY = 0;
	let originX = 0;
	let originY = 0;

	type Dir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
	const handles: Dir[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
	let resizing: Dir | null = null;
	let origin = { x: 0, y: 0, w: 0, h: 0 };

	function onResizeDown(e: PointerEvent, dir: Dir) {
		if (win.maximized) return;
		e.stopPropagation();
		resizing = dir;
		startX = e.clientX;
		startY = e.clientY;
		origin = { x: win.x, y: win.y, w: win.width, h: win.height };
		wm.focus(win.id);
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onResizeMove(e: PointerEvent) {
		if (!resizing) return;
		const dx = e.clientX - startX;
		const dy = e.clientY - startY;
		let { x, y, w, h } = origin;

		if (resizing.includes('e')) w = Math.max(MIN_W, origin.w + dx);
		if (resizing.includes('s')) h = Math.max(MIN_H, origin.h + dy);
		if (resizing.includes('w')) {
			w = Math.max(MIN_W, origin.w - dx);
			x = origin.x + (origin.w - w);
		}
		if (resizing.includes('n')) {
			h = Math.max(MIN_H, origin.h - dy);
			y = origin.y + (origin.h - h);
		}
		wm.setGeometry(win.id, { x, y, width: w, height: h });
	}

	function onResizeUp() {
		resizing = null;
	}

	function onTitleDown(e: PointerEvent) {
		if (win.maximized) return;
		dragging = true;
		startX = e.clientX;
		startY = e.clientY;
		originX = win.x;
		originY = win.y;
		wm.focus(win.id);
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onTitleMove(e: PointerEvent) {
		if (!dragging) return;
		wm.move(win.id, originX + (e.clientX - startX), originY + (e.clientY - startY));
	}

	function onTitleUp() {
		dragging = false;
	}
</script>

<div
	class="window"
	class:maximized={win.maximized}
	role="dialog"
	aria-label={win.title}
	tabindex="-1"
	style="left: {win.x}px; top: {win.y}px; width: {win.width}px; height: {win.height}px; z-index: {win.z}; display: {win.minimized ? 'none' : 'flex'}"
	onpointerdown={() => wm.focus(win.id)}
>
	<header
		class="titlebar"
		role="toolbar"
		tabindex="-1"
		aria-label="Barra de título"
		onpointerdown={onTitleDown}
		onpointermove={onTitleMove}
		onpointerup={onTitleUp}
		ondblclick={() => wm.toggleMaximize(win.id)}
	>
		<div class="lights">
			<button class="light close" aria-label="Cerrar" onclick={() => wm.close(win.id)}></button>
			<button class="light min" aria-label="Minimizar" onclick={() => wm.minimize(win.id)}></button>
			<button
				class="light max"
				aria-label="Maximizar"
				onclick={() => wm.toggleMaximize(win.id)}
			></button>
		</div>
		<span class="title">{win.title}</span>
		<div class="spacer"></div>
	</header>

	<div class="body">
		<aside class="sidebar">
			<span class="group">Favoritos</span>
			<span class="row active">Escritorio</span>
			<span class="row">Documentos</span>
			<span class="row">Descargas</span>
			<span class="group">Ubicaciones</span>
			<span class="row">ArchMac</span>
			<span class="row">Red</span>
		</aside>
		<div class="content">
			<p class="hint">Ventana de <strong>{win.title}</strong></p>
			<p class="sub">Arrástrala desde la barra. Doble clic para maximizar.</p>
		</div>
	</div>

	{#if !win.maximized}
		{#each handles as dir}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="handle {dir}"
				onpointerdown={(e) => onResizeDown(e, dir)}
				onpointermove={onResizeMove}
				onpointerup={onResizeUp}
			></div>
		{/each}
	{/if}
</div>

<style>
	.window {
		position: absolute;
		display: flex;
		flex-direction: column;
		background: var(--surface-strong);
		backdrop-filter: var(--blur-panel);
		-webkit-backdrop-filter: var(--blur-panel);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		overflow: hidden;
		transition:
			width var(--dur-med) var(--ease-out),
			height var(--dur-med) var(--ease-out),
			left var(--dur-med) var(--ease-out),
			top var(--dur-med) var(--ease-out);
	}

	.titlebar {
		height: 38px;
		display: flex;
		align-items: center;
		padding: 0 var(--space-3);
		gap: var(--space-3);
		border-bottom: 1px solid var(--border);
		cursor: default;
		flex: none;
	}

	.lights {
		display: flex;
		gap: 8px;
	}

	.light {
		width: 12px;
		height: 12px;
		border-radius: var(--radius-full);
		border: none;
		cursor: pointer;
		padding: 0;
	}
	.close {
		background: #ff5f57;
	}
	.min {
		background: #febc2e;
	}
	.max {
		background: #28c840;
	}
	.light:hover {
		filter: brightness(0.9);
	}

	.title {
		font-size: var(--text-sm);
		font-weight: var(--weight-semibold);
		color: var(--text);
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}

	.spacer {
		flex: 1;
	}

	.body {
		display: flex;
		flex: 1;
		min-height: 0;
	}

	.sidebar {
		width: 180px;
		flex: none;
		background: var(--surface);
		border-right: 1px solid var(--border);
		padding: var(--space-3);
		display: flex;
		flex-direction: column;
		gap: 2px;
		font-size: var(--text-sm);
	}

	.group {
		font-size: var(--text-xs);
		font-weight: var(--weight-semibold);
		color: var(--text-muted);
		margin-top: var(--space-3);
		margin-bottom: var(--space-1);
		text-transform: uppercase;
		letter-spacing: 0.4px;
	}

	.row {
		padding: 5px var(--space-2);
		border-radius: var(--radius-sm);
		color: var(--text);
		cursor: default;
	}
	.row:hover {
		background: var(--surface-strong);
	}
	.row.active {
		background: var(--accent);
		color: #fff;
	}

	.content {
		flex: 1;
		padding: var(--space-5);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.hint {
		font-size: var(--text-lg);
		color: var(--text);
	}
	.sub {
		font-size: var(--text-sm);
		color: var(--text-muted);
	}

	/* ----- Handles de redimensionado ----- */
	.handle {
		position: absolute;
		touch-action: none;
	}
	.handle.n,
	.handle.s {
		left: 6px;
		right: 6px;
		height: 6px;
		cursor: ns-resize;
	}
	.handle.e,
	.handle.w {
		top: 6px;
		bottom: 6px;
		width: 6px;
		cursor: ew-resize;
	}
	.handle.n {
		top: -3px;
	}
	.handle.s {
		bottom: -3px;
	}
	.handle.e {
		right: -3px;
	}
	.handle.w {
		left: -3px;
	}
	.handle.ne,
	.handle.nw,
	.handle.se,
	.handle.sw {
		width: 12px;
		height: 12px;
	}
	.handle.ne {
		top: -3px;
		right: -3px;
		cursor: nesw-resize;
	}
	.handle.nw {
		top: -3px;
		left: -3px;
		cursor: nwse-resize;
	}
	.handle.se {
		bottom: -3px;
		right: -3px;
		cursor: nwse-resize;
	}
	.handle.sw {
		bottom: -3px;
		left: -3px;
		cursor: nesw-resize;
	}
</style>
