/*
 * Gestor de ventanas de ArchMac (estado global con runes de Svelte 5).
 * Maneja apertura, foco (z-index), posición, minimizado y maximizado.
 */

export type WindowState = {
	id: string;
	appId: string;
	title: string;
	x: number;
	y: number;
	width: number;
	height: number;
	z: number;
	minimized: boolean;
	maximized: boolean;
	/** geometría previa, para restaurar tras maximizar */
	restore?: { x: number; y: number; width: number; height: number };
};

class WindowManager {
	windows = $state<WindowState[]>([]);
	#seq = 0;
	#topZ = 10;

	/** Apps que ya tienen ventana abierta (para indicadores del dock). */
	openApps = $derived(new Set(this.windows.map((w) => w.appId)));

	open(appId: string, title: string) {
		// Si ya está abierta, solo enfoca y desminimiza.
		const existing = this.windows.find((w) => w.appId === appId);
		if (existing) {
			existing.minimized = false;
			this.focus(existing.id);
			return;
		}

		const offset = (this.#seq % 6) * 28;
		this.windows.push({
			id: `win-${++this.#seq}`,
			appId,
			title,
			x: 160 + offset,
			y: 90 + offset,
			width: 720,
			height: 460,
			z: ++this.#topZ,
			minimized: false,
			maximized: false
		});
	}

	focus(id: string) {
		const w = this.windows.find((w) => w.id === id);
		if (w) w.z = ++this.#topZ;
	}

	close(id: string) {
		this.windows = this.windows.filter((w) => w.id !== id);
	}

	minimize(id: string) {
		const w = this.windows.find((w) => w.id === id);
		if (w) w.minimized = true;
	}

	toggleMaximize(id: string) {
		const w = this.windows.find((w) => w.id === id);
		if (!w) return;
		if (w.maximized) {
			Object.assign(w, w.restore);
			w.maximized = false;
		} else {
			w.restore = { x: w.x, y: w.y, width: w.width, height: w.height };
			w.x = 8;
			w.y = 36;
			w.width = window.innerWidth - 16;
			w.height = window.innerHeight - 44 - 80;
			w.maximized = true;
		}
		this.focus(id);
	}

	move(id: string, x: number, y: number) {
		const w = this.windows.find((w) => w.id === id);
		if (w && !w.maximized) {
			w.x = x;
			w.y = y;
		}
	}

	setGeometry(id: string, geo: { x: number; y: number; width: number; height: number }) {
		const w = this.windows.find((w) => w.id === id);
		if (w && !w.maximized) Object.assign(w, geo);
	}
}

export const MIN_W = 380;
export const MIN_H = 240;

export const wm = new WindowManager();
