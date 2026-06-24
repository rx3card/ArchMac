import { toCanvas } from 'html-to-image';

/*
 * Efecto Genie (minimizar/restaurar) al estilo macOS.
 *
 * Técnica (la de BCGenieEffect / Harshil Shah, llevada a la web):
 *  1. Se captura la ventana como imagen (textura). Se PRE-CARGA al pasar el ratón por el
 *     botón de minimizar, para que la animación arranque al instante (sin trabón).
 *  2. La imagen se corta en muchas franjas horizontales (malla deformable).
 *  3. Cada franja se desplaza y estrecha hacia el icono del dock con dos animaciones
 *     superpuestas: SLIDE (embudo, ~55%) y TRANSLATE (succión vertical, desde ~35%).
 *     Los lados se curvan con una interpolación cuadrática (quadraticEaseInOut).
 */

const DURATION = 600; // ms
const SLIDE_END = 0.55;
const TRANSLATE_START = 0.35;
const STRIPS = 240; // nº de franjas (más = lados más suaves, sin escalones)

type Rect = { left: number; top: number; width: number; height: number };

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const quadraticEaseInOut = (t: number) => (t < 0.5 ? 2 * t * t : -2 * t * t + 4 * t - 1);

/** Captura una ventana como textura (para precargarla y que el genie arranque al instante). */
export async function captureWindow(el: HTMLElement): Promise<HTMLCanvasElement | null> {
	try {
		return await toCanvas(el, { pixelRatio: 1 });
	} catch {
		return null;
	}
}

function drawGenie(
	ctx: CanvasRenderingContext2D,
	img: HTMLCanvasElement,
	src: Rect,
	dock: { cx: number; cy: number; w: number },
	fraction: number,
) {
	const f = clamp01(fraction);
	const slide = clamp01(f / SLIDE_END);
	const trans = clamp01((f - TRANSLATE_START) / (1 - TRANSLATE_START));

	const srcTop = src.top;
	const srcBottom = src.top + src.height;
	const dockY = dock.cy;
	const dockLeft = dock.cx - dock.w / 2;
	const dockRight = dock.cx + dock.w / 2;

	// El borde inferior llega al dock antes que el superior → cuello estirado.
	const topY = lerp(srcTop, dockY, trans);
	const bottomY = lerp(srcBottom, dockY, clamp01(f / 0.5));

	const imgW = img.width;
	const imgH = img.height;

	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.globalAlpha = f > 0.86 ? clamp01(1 - (f - 0.86) / 0.14) : 1;

	for (let i = 0; i < STRIPS; i++) {
		const p0 = i / STRIPS;
		const p1 = (i + 1) / STRIPS;
		const pm = (p0 + p1) / 2;

		// El "cuello" del embudo sube desde el dock (p=1) hacia arriba conforme avanza `slide`.
		const funnel = quadraticEaseInOut(clamp01((pm - (1 - slide)) / Math.max(slide, 1e-4)));
		// Al final (fase de succión `trans`) TODA la ventana —incluida la parte superior— se
		// colapsa hasta el ancho del dock, para que termine como una línea/punto y no con el
		// tope ancho.
		const narrow = funnel + (1 - funnel) * trans;
		const lx = lerp(src.left, dockLeft, narrow);
		const rx = lerp(src.left + src.width, dockRight, narrow);
		const w = Math.max(0.5, rx - lx);

		const y0 = topY + p0 * (bottomY - topY);
		const y1 = topY + p1 * (bottomY - topY);

		const sY = p0 * imgH;
		const sH = imgH / STRIPS;

		ctx.drawImage(img, 0, sY, imgW, sH, lx, y0, w, y1 - y0 + 1);
	}
	ctx.globalAlpha = 1;
}

/**
 * Anima el efecto genie de `windowEl` hacia/desde el icono del dock.
 * @param reverse   true = restaurar (reproduce la animación al revés).
 * @param snapshot  textura ya capturada (precargada o de la minimización, para reutilizar).
 * @returns la textura usada (para cachearla), o null si la captura falló.
 */
export async function genie(
	windowEl: HTMLElement,
	dockIcon: HTMLElement | null,
	reverse = false,
	snapshot?: HTMLCanvasElement,
): Promise<HTMLCanvasElement | null> {
	const rect = windowEl.getBoundingClientRect();
	const src: Rect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };

	const dr = dockIcon?.getBoundingClientRect();
	const dock = dr
		? { cx: dr.left + dr.width / 2, cy: dr.top + dr.height / 2, w: dr.width }
		: { cx: src.left + src.width / 2, cy: window.innerHeight - 20, w: 60 };

	const texture = snapshot ?? (await captureWindow(windowEl));
	if (!texture) return null;

	windowEl.style.opacity = '0'; // ocultar la ventana real; solo se ve la malla animada

	const canvas = document.createElement('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.cssText =
		'position:fixed;inset:0;width:100vw;height:100vh;z-index:99999;pointer-events:none;';
	document.body.appendChild(canvas);
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		canvas.remove();
		return texture;
	}
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = 'high';

	await new Promise<void>((resolve) => {
		const start = performance.now();
		function frame(now: number) {
			const p = clamp01((now - start) / DURATION);
			drawGenie(ctx!, texture!, src, dock, reverse ? 1 - p : p);
			if (p >= 1) {
				canvas.remove();
				resolve();
				return;
			}
			requestAnimationFrame(frame);
		}
		requestAnimationFrame(frame);
	});

	return texture;
}
