<script lang="ts">
	import {
		bounds,
		BoundsFrom,
		Compartment,
		ControlFrom,
		controls,
		disabled,
		draggable,
		events,
		position,
	} from '@neodrag/svelte';
	import { onMount, tick, untrack } from 'svelte';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { elevation } from '$lib/actions';
	import { genie, captureWindow } from '$lib/helpers/genie.ts';
	import { apps_config } from '$lib/configs/apps/apps-config.ts';
	import { rand_int } from '$lib/helpers/random.ts';
	import { sleep } from '$lib/helpers/sleep';
	import { apps, type AppID } from '$lib/state/apps.svelte.ts';
	import { preferences } from '$lib/state/preferences.svelte.ts';
	import { snap } from '$lib/state/snap.svelte.ts';

	import AppNexus from '../../apps/AppNexus.svelte';
	import TrafficLights from './TrafficLights.svelte';

	const { app_id }: { app_id: AppID } = $props();

	let dragging_enabled = $state(true);

	let is_maximized = $state(false);

	let windowEl = $state<HTMLElement>();

	const { height, width, resizable } = apps_config[app_id];

	const remModifier = +height * 1.2 >= window.innerHeight ? 24 : 16;

	const randX = rand_int(-600, 600);
	const randY = rand_int(-100, 100);

	let defaultPosition = {
		x: (document.body.clientWidth / 2 + randX) / 2,
		y: (100 + randY) / 2,
	};

	// Posición controlada por neodrag (propiedad CSS `translate`). Mantenerla en estado
	// permite que neodrag sincronice su offset interno cuando la cambiamos al redimensionar
	// desde un borde izquierdo/superior (si no, daría un salto en el siguiente arrastre).
	let pos = $state({ x: defaultPosition.x, y: defaultPosition.y });

	const disabledComp = Compartment.of(() => disabled(!dragging_enabled));
	const positionComp = Compartment.of(() => position({ current: pos }));

	// ----- Redimensionado por bordes y esquinas -----
	const MIN_W = 320;
	const MIN_H = 200;
	type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
	const resizeHandles: ResizeDir[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

	let resizing = false;
	let resizeData = { dir: 'se' as ResizeDir, x: 0, y: 0, w: 0, h: 0, px: 0, py: 0 };

	function onResizeStart(e: PointerEvent, dir: ResizeDir) {
		if (is_maximized) return;
		e.stopPropagation();
		e.preventDefault();
		focusApp();

		const rect = windowEl.getBoundingClientRect();
		resizeData = { dir, x: e.clientX, y: e.clientY, w: rect.width, h: rect.height, px: pos.x, py: pos.y };
		resizing = true;

		(e.target as HTMLElement).setPointerCapture(e.pointerId);
		window.addEventListener('pointermove', onResizeMove);
		window.addEventListener('pointerup', onResizeEnd);
	}

	function onResizeMove(e: PointerEvent) {
		if (!resizing) return;
		const { dir, x, y, w: w0, h: h0, px, py } = resizeData;
		const dx = e.clientX - x;
		const dy = e.clientY - y;

		let w = w0;
		let h = h0;
		let nx = px;
		let ny = py;

		if (dir.includes('e')) w = Math.max(MIN_W, w0 + dx);
		if (dir.includes('s')) h = Math.max(MIN_H, h0 + dy);
		if (dir.includes('w')) {
			w = Math.max(MIN_W, w0 - dx);
			nx = px + (w0 - w);
		}
		if (dir.includes('n')) {
			h = Math.max(MIN_H, h0 - dy);
			ny = py + (h0 - h);
		}

		windowEl.style.width = `${w}px`;
		windowEl.style.height = `${h}px`;
		pos = { x: nx, y: ny };
	}

	function onResizeEnd() {
		resizing = false;
		window.removeEventListener('pointermove', onResizeMove);
		window.removeEventListener('pointerup', onResizeEnd);
	}

	$effect(() => {
		apps.active_z_index;

		if (apps.active === app_id) {
			untrack(() => (apps.z_indices[app_id] = apps.active_z_index));
		}
	});

	function focusApp() {
		apps.active = app_id;
	}

	// Cierre estilo macOS: la ventana se encoge un poco + fade-out (simétrico a la apertura).
	function windowCloseTransition(
		_el: HTMLElement,
		{ duration = preferences.reduced_motion ? 0 : 180 }: SvelteTransitionConfig = {},
	): SvelteTransitionReturnType {
		return {
			duration,
			easing: cubicIn,
			// t va de 1 → 0 en la salida: escala 1 → 0.9 y opacidad 1 → 0.
			css: (t) => `opacity: ${t}; transform: scale(${0.9 + 0.1 * t})`,
		};
	}

	// Apertura estilo macOS: la ventana crece desde un poco más pequeña + fade-in.
	function windowOpenTransition(
		_el: HTMLElement,
		{ duration = preferences.reduced_motion ? 0 : 200 }: SvelteTransitionConfig = {},
	): SvelteTransitionReturnType {
		return {
			duration,
			easing: cubicOut,
			css: (t) => `opacity: ${t}; transform: scale(${0.9 + 0.1 * t})`,
		};
	}

	let flipping = $state(false);

	async function maximizeApp() {
		// El tamaño/posición final los fija la clase .maximized (CSS). La animación se hace con
		// FLIP: se mide antes y después, y se anima SOLO `transform` (acelerado por GPU) en vez de
		// `width/height` (que provocaban reflow + recálculo de blur → trabón). Durante la animación
		// se desactiva el backdrop-filter para máxima fluidez.
		const apply = () => {
			is_maximized = !is_maximized;
			dragging_enabled = !is_maximized;
			apps.fullscreen[app_id] = is_maximized;
		};

		if (preferences.reduced_motion) {
			apply();
			return;
		}

		const first = windowEl.getBoundingClientRect();
		apply();
		await tick();
		const last = windowEl.getBoundingClientRect();

		const dx = first.left - last.left;
		const dy = first.top - last.top;
		const sx = last.width ? first.width / last.width : 1;
		const sy = last.height ? first.height / last.height : 1;

		flipping = true;
		windowEl.style.transition = 'none';
		windowEl.style.transformOrigin = 'top left';
		windowEl.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
		void windowEl.getBoundingClientRect(); // forzar reflow

		windowEl.style.transition = 'transform 0.34s cubic-bezier(0.22, 1, 0.36, 1)';
		windowEl.style.transform = 'translate(0px, 0px) scale(1, 1)';

		await sleep(340);

		windowEl.style.transition = '';
		windowEl.style.transform = '';
		windowEl.style.transformOrigin = '';
		flipping = false;
	}

	function closeApp() {
		apps.open[app_id] = false;
		apps.fullscreen[app_id] = false;
		apps.minimized[app_id] = false;
	}

	const dock_icon = () =>
		document.querySelector<HTMLElement>(`.dock-open-app-button.${app_id} img`) ??
		document.querySelector<HTMLElement>(`.dock-open-app-button.${app_id}`);

	let genie_snapshot: HTMLCanvasElement | null = null;
	let animating = false;
	let capturing = false;

	// Pre-captura la ventana como textura para que el genie arranque SIN trabón.
	async function prepareSnapshot() {
		if (capturing || animating || !windowEl) return;
		capturing = true;
		const snap = await captureWindow(windowEl);
		if (snap) genie_snapshot = snap;
		capturing = false;
	}

	// Al abrir, precargamos una captura (tras un momento, ya renderizado el contenido).
	onMount(() => {
		const id = setTimeout(prepareSnapshot, 700);
		return () => clearTimeout(id);
	});

	// Minimizar: efecto genie (malla WebGL) hacia el icono del dock.
	async function minimizeApp() {
		if (animating) return;

		if (preferences.reduced_motion) {
			apps.minimized[app_id] = true;
			return;
		}

		animating = true;
		// Usa la captura precargada (instantáneo); si no hay, genie la captura.
		const used = await genie(windowEl, dock_icon(), false, genie_snapshot ?? undefined);
		if (used) genie_snapshot = used;
		animating = false;

		// Si la captura falló, respaldo: simple desvanecido.
		if (!used) windowEl.style.opacity = '0';

		apps.minimized[app_id] = true;
	}

	// Restaurar desde el dock: se anima de vuelta cuando `minimized` pasa a false.
	$effect(() => {
		const minimized = apps.minimized[app_id];
		if (minimized || !windowEl) return;

		untrack(async () => {
			if (windowEl.style.opacity !== '0' || animating) return;

			if (preferences.reduced_motion) {
				windowEl.style.opacity = '1';
				focusApp();
				return;
			}

			animating = true;
			await genie(windowEl, dock_icon(), true, genie_snapshot ?? undefined);
			windowEl.style.opacity = '1';
			animating = false;
			focusApp();
		});
	});

	// ----- Acomodar a los bordes (snapping / mosaico estilo macOS) -----
	const TOPBAR = 28; // alto de la barra de menús

	function computeZone(cx: number, cy: number): import('$lib/state/snap.svelte').SnapZone | null {
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const E = 8; // distancia del cursor al borde para activar
		const top = TOPBAR;
		const availH = vh - top;
		const halfW = vw / 2;
		const halfH = availH / 2;

		// Borde superior → pantalla completa.
		if (cy <= top + E) return { x: 0, y: top, w: vw, h: availH, key: 'full' };

		// Borde izquierdo → mitad / cuartos.
		if (cx <= E) {
			if (cy < top + availH * 0.33) return { x: 0, y: top, w: halfW, h: halfH, key: 'tl' };
			if (cy > top + availH * 0.66)
				return { x: 0, y: top + halfH, w: halfW, h: halfH, key: 'bl' };
			return { x: 0, y: top, w: halfW, h: availH, key: 'left' };
		}

		// Borde derecho → mitad / cuartos.
		if (cx >= vw - E) {
			if (cy < top + availH * 0.33) return { x: halfW, y: top, w: halfW, h: halfH, key: 'tr' };
			if (cy > top + availH * 0.66)
				return { x: halfW, y: top + halfH, w: halfW, h: halfH, key: 'br' };
			return { x: halfW, y: top, w: halfW, h: availH, key: 'right' };
		}

		return null;
	}

	function onPointerMoveSnap(e: PointerEvent) {
		snap.zone = computeZone(e.clientX, e.clientY);
	}

	function onAppDragStart() {
		focusApp();
		apps.is_being_dragged = true;
		window.addEventListener('pointermove', onPointerMoveSnap);
	}

	function onAppDrag({ offset }: { offset: { x: number; y: number } }) {
		// Reflejamos el arrastre en el estado controlado para mantener la posición sincronizada.
		pos = { x: offset.x, y: offset.y };
	}

	function onAppDragEnd() {
		apps.is_being_dragged = false;
		window.removeEventListener('pointermove', onPointerMoveSnap);

		const zone = snap.zone;
		snap.zone = null;
		if (!zone) return;

		// Ajustar la ventana a la zona: el top-left absoluto se mueve a (zone.x, zone.y).
		const r = windowEl.getBoundingClientRect();
		windowEl.style.transition = preferences.reduced_motion
			? ''
			: 'width 0.18s ease, height 0.18s ease, translate 0.18s ease';
		windowEl.style.width = `${zone.w}px`;
		windowEl.style.height = `${zone.h}px`;
		pos = { x: pos.x + (zone.x - r.left), y: pos.y + (zone.y - r.top) };
		setTimeout(() => {
			if (windowEl) windowEl.style.transition = '';
		}, 220);
	}

	onMount(() => windowEl?.focus());
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<section
	role="application"
	class="container"
	class:dark={preferences.theme.scheme === 'dark'}
	class:active={apps.active === app_id}
	class:maximized={is_maximized}
	class:minimized={apps.minimized[app_id]}
	class:flipping={flipping}
	style:width="{+width / remModifier}rem"
	style:height="{+height / remModifier}rem"
	style:z-index={apps.z_indices[app_id]}
	tabindex="-1"
	bind:this={windowEl}
	{@attach draggable(() => [
		controls({ allow: ControlFrom.selector('.app-window-drag-handle') }),
		bounds(BoundsFrom.viewport({ bottom: -6000, top: 27.2, left: -6000, right: -6000 })),
		disabledComp,
		positionComp,
		events({ onDragStart: onAppDragStart, onDrag: onAppDrag, onDragEnd: onAppDragEnd }),
	])}
	onclick={focusApp}
	onkeydown={() => {}}
	in:windowOpenTransition
	out:windowCloseTransition
>
	<div class="tl-container {app_id}" use:elevation={'window-traffic-lights'}>
		<TrafficLights
			{app_id}
			on_maximize_click={maximizeApp}
			on_minimize_click={minimizeApp}
			on_minimize_hover={prepareSnapshot}
			on_close_app={closeApp}
		/>
	</div>

	<AppNexus {app_id} is_being_dragged={apps.is_being_dragged} />

	{#if resizable && !is_maximized}
		{#each resizeHandles as dir}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="resize-handle {dir}" onpointerdown={(e) => onResizeStart(e, dir)}></div>
		{/each}
	{/if}
</section>

<style>
	.container {
		--elevated-shadow: 0px 8.5px 10px rgba(0, 0, 0, 0.115), 0px 68px 80px rgba(0, 0, 0, 0.23);

		width: 100%;
		height: 100%;

		display: grid;
		grid-template-rows: 1fr;

		position: absolute;

		will-change: width, height;

		border-radius: 0.75rem;
		box-shadow: var(--elevated-shadow);

		cursor: var(--system-cursor-default), auto;

		&.active {
			/* // --elevated-shadow: 0px 6.7px 12px rgba(0, 0, 0, 0.218), 0px 22.3px 40.2px rgba(0, 0, 0, 0.322),
      //   0px 100px 180px rgba(0, 0, 0, 0.54); */
			--elevated-shadow: 0px 8.5px 10px rgba(0, 0, 0, 0.28), 0px 68px 80px rgba(0, 0, 0, 0.56);
		}

		&.dark {
			& > :global(section),
			& > :global(div:not(.resize-handle):not(.tl-container)) {
				border-radius: inherit;
				box-shadow:
					inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
					0 0 0 1px hsla(var(--system-color-light-hsl), 0.5),
					var(--elevated-shadow);
			}
		}
	}

	/* Maximizado: fijamos posición y tamaño a pantalla completa (bajo la barra superior).
	   El reset del desplazamiento (`translate`) lo hace el JS, porque neodrag posiciona
	   con esa propiedad. */
	.container.maximized {
		/* Sobreescribimos el `translate` de neodrag para anclar la ventana arriba-izquierda.
		   Va solo (sin `transform`) para que lightningcss no lo fusione ni lo elimine. */
		translate: 0 0 !important;
		top: 1.7rem;
		left: 0;
		width: 100vw !important;
		height: calc(100vh - 1.7rem) !important;
	}

	/* Minimizada: colapsada hacia el dock; no debe interceptar clics. */
	.container.minimized {
		pointer-events: none;
	}

	/* Durante la animación de maximizar/restaurar (FLIP): desactivar el blur (costoso por frame)
	   y promover a su propia capa para que sea totalmente fluido. */
	.container.flipping {
		will-change: transform;
		pointer-events: none;
	}
	.container.flipping,
	.container.flipping :global(*) {
		backdrop-filter: none !important;
		-webkit-backdrop-filter: none !important;
	}

	.tl-container {
		position: absolute;
		top: 1rem;
		left: 1rem;

		/* // Necessary, as `.container` tries to apply shadow on it */
		box-shadow: none !important;
	}

	/* ----- Handles de redimensionado (bordes y esquinas) ----- */
	.resize-handle {
		position: absolute;
		z-index: 2;
		touch-action: none;
	}
	.resize-handle.n,
	.resize-handle.s {
		left: 10px;
		right: 10px;
		height: 8px;
		cursor: ns-resize;
	}
	.resize-handle.e,
	.resize-handle.w {
		top: 10px;
		bottom: 10px;
		width: 8px;
		cursor: ew-resize;
	}
	.resize-handle.n {
		top: -4px;
	}
	.resize-handle.s {
		bottom: -4px;
	}
	.resize-handle.e {
		right: -4px;
	}
	.resize-handle.w {
		left: -4px;
	}
	.resize-handle.ne,
	.resize-handle.nw,
	.resize-handle.se,
	.resize-handle.sw {
		width: 16px;
		height: 16px;
	}
	.resize-handle.ne {
		top: -5px;
		right: -5px;
		cursor: nesw-resize;
	}
	.resize-handle.nw {
		top: -5px;
		left: -5px;
		cursor: nwse-resize;
	}
	.resize-handle.se {
		bottom: -5px;
		right: -5px;
		cursor: nwse-resize;
	}
	.resize-handle.sw {
		bottom: -5px;
		left: -5px;
		cursor: nesw-resize;
	}
</style>
