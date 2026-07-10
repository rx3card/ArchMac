<script lang="ts">
	import { preferences } from '$lib/state/preferences.svelte.ts';
	import { apps } from '$lib/state/apps.svelte.ts';
	import { colors } from '$lib/configs/theme/colors.config.ts';

	import WifiIcon from '~icons/mdi/wifi';
	import BluetoothIcon from '~icons/mdi/bluetooth';
	import NetworkIcon from '~icons/mdi/web';
	import BatteryIcon from '~icons/mdi/battery-70';
	import GeneralIcon from '~icons/mdi/cog';
	import AccessIcon from '~icons/mdi/human';
	import AppearanceIcon from '~icons/mdi/theme-light-dark';
	import DockIcon from '~icons/mdi/dock-bottom';
	import DisplayIcon from '~icons/mdi/monitor';
	import SpotlightIcon from '~icons/mdi/magnify';
	import WallpaperIcon from '~icons/mdi/image';

	type Cat = { id: string; label: string; color: string; group: number };
	const categories: Cat[] = [
		{ id: 'wifi', label: 'Wi-Fi', color: '#3b82f6', group: 0 },
		{ id: 'bluetooth', label: 'Bluetooth', color: '#3b82f6', group: 0 },
		{ id: 'network', label: 'Red', color: '#3b82f6', group: 0 },
		{ id: 'battery', label: 'Batería', color: '#22c55e', group: 0 },
		{ id: 'general', label: 'General', color: '#8e8e93', group: 1 },
		{ id: 'access', label: 'Accesibilidad', color: '#0a84ff', group: 1 },
		{ id: 'appearance', label: 'Apariencia', color: '#1c1c1e', group: 1 },
		{ id: 'dock', label: 'Escritorio y Dock', color: '#5856d6', group: 1 },
		{ id: 'display', label: 'Pantallas', color: '#0a84ff', group: 1 },
		{ id: 'spotlight', label: 'Spotlight', color: '#8e8e93', group: 1 },
		{ id: 'wallpaper', label: 'Fondo de pantalla', color: '#34c759', group: 1 },
	];

	let active = $state('appearance');

	const accents: (keyof typeof colors)[] = [
		'blue',
		'purple',
		'pink',
		'orange',
		'green',
		'cyan',
		'indigo',
	];

	function setScheme(s: 'light' | 'dark' | 'auto') {
		preferences.theme.scheme =
			s === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : s;
	}
	function accentColor(k: keyof typeof colors) {
		return `hsl(${colors[k][preferences.theme.scheme].hsl})`;
	}
</script>

<div class="settings">
	<aside class="app-window-drag-handle">
		<div class="account">
			<div class="avatar">🦁</div>
			<div>
				<div class="name">Usuario ArchMac</div>
				<div class="sub">Cuenta local</div>
			</div>
		</div>

		<input class="search" placeholder="Buscar" />

		{#each [0, 1] as g}
			<ul>
				{#each categories.filter((c) => c.group === g) as cat}
					<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
					<li class:active={active === cat.id} onclick={() => (active = cat.id)}>
						<span class="ic" style:background={cat.color}>
							{#if cat.id === 'wifi'}<WifiIcon />{:else if cat.id === 'bluetooth'}<BluetoothIcon
								/>{:else if cat.id === 'network'}<NetworkIcon />{:else if cat.id === 'battery'}<BatteryIcon
								/>{:else if cat.id === 'general'}<GeneralIcon />{:else if cat.id === 'access'}<AccessIcon
								/>{:else if cat.id === 'appearance'}<AppearanceIcon />{:else if cat.id === 'dock'}<DockIcon
								/>{:else if cat.id === 'display'}<DisplayIcon />{:else if cat.id === 'spotlight'}<SpotlightIcon
								/>{:else}<WallpaperIcon />{/if}
						</span>
						{cat.label}
					</li>
				{/each}
			</ul>
		{/each}
	</aside>

	<main>
		{#if active === 'appearance'}
			<h1>Apariencia</h1>

			<div class="row">
				<span class="row-label">Apariencia</span>
				<div class="schemes">
					{#each [{ id: 'auto', label: 'Auto' }, { id: 'light', label: 'Claro' }, { id: 'dark', label: 'Oscuro' }] as opt}
						<button
							class="scheme {opt.id}"
							class:sel={opt.id !== 'auto' && preferences.theme.scheme === opt.id}
							onclick={() => setScheme(opt.id as 'light' | 'dark' | 'auto')}
						>
							<span class="preview {opt.id}"></span>
							<span>{opt.label}</span>
						</button>
					{/each}
				</div>
			</div>

			<div class="card">
				<div class="card-row">
					<span>Color de acento</span>
					<div class="accents">
						{#each accents as a}
							<button
								class="swatch"
								class:sel={preferences.theme.primaryColor === a}
								style:background={accentColor(a)}
								aria-label={a}
								onclick={() => (preferences.theme.primaryColor = a)}
							></button>
						{/each}
					</div>
				</div>
			</div>

			<div class="card">
				<div class="card-row toggle-row">
					<span>Cambiar a modo oscuro/claro según el fondo</span>
					<button
						class="switch"
						class:on={preferences.wallpaper.canControlTheme}
						onclick={() =>
							(preferences.wallpaper.canControlTheme = !preferences.wallpaper.canControlTheme)}
						aria-label="Alternar"
					><span class="knob"></span></button>
				</div>
			</div>
		{:else}
			<h1>{categories.find((c) => c.id === active)?.label}</h1>
			<div class="empty">
				<p>Esta sección de Ajustes está en construcción.</p>
				<p class="muted">El prototipo se centra en Apariencia (tema y acento), que sí funciona.</p>
			</div>
		{/if}
	</main>
</div>

<style>
	.settings {
		display: grid;
		grid-template-columns: 230px 1fr;
		height: 100%;
		border-radius: inherit;
		overflow: hidden;
		background: var(--system-color-light, #fff);
		color: var(--system-color-dark, #1c1c1e);
		font-family: var(--system-font-family, system-ui);
	}

	aside {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 2.2rem 0.7rem 0.7rem;
		background: hsla(var(--system-color-light-hsl, 0 0% 100%), 0.55);
		border-right: 1px solid hsla(var(--system-color-dark-hsl, 0 0% 0%), 0.08);
		overflow-y: auto;
	}
	.account {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.4rem 0.5rem 0.6rem;
	}
	.avatar {
		display: grid;
		place-items: center;
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 50%;
		background: linear-gradient(135deg, #ffb347, #ff7e5f);
		font-size: 1.3rem;
	}
	.name {
		font-weight: 600;
		font-size: 0.9rem;
	}
	.sub {
		font-size: 0.75rem;
		color: hsla(var(--system-color-dark-hsl), 0.5);
	}
	.search {
		margin: 0 0.4rem 0.5rem;
		padding: 0.35rem 0.6rem;
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.12);
		border-radius: 0.5rem;
		background: hsla(var(--system-color-dark-hsl), 0.05);
		font: inherit;
		font-size: 0.85rem;
		color: inherit;
	}
	ul {
		list-style: none;
		margin: 0 0 0.4rem;
		padding: 0;
	}
	li {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.32rem 0.5rem;
		border-radius: 0.5rem;
		font-size: 0.88rem;
		cursor: default;
	}
	li.active {
		background: var(--system-color-primary, #0a84ff);
		color: #fff;
	}
	.ic {
		display: grid;
		place-items: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 0.35rem;
		color: #fff;
		flex: none;
	}
	.ic :global(svg) {
		font-size: 0.95rem;
	}

	main {
		padding: 2.2rem 2rem;
		overflow-y: auto;
	}
	h1 {
		font-size: 1.6rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
	}

	.row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 2rem;
		margin-bottom: 1.5rem;
	}
	.row-label {
		font-size: 0.95rem;
		padding-top: 0.5rem;
	}
	.schemes {
		display: flex;
		gap: 1.2rem;
	}
	.scheme {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.85rem;
		color: inherit;
	}
	.preview {
		width: 3.6rem;
		height: 2.4rem;
		border-radius: 0.5rem;
		border: 2px solid transparent;
		box-shadow: 0 1px 4px hsla(0, 0%, 0%, 0.2);
	}
	.preview.auto {
		background: linear-gradient(105deg, #dfe6f0 50%, #2b2f3a 50%);
	}
	.preview.light {
		background: linear-gradient(160deg, #eef1f6, #cdd6e6);
	}
	.preview.dark {
		background: linear-gradient(160deg, #2b2f3a, #14151b);
	}
	.scheme.sel .preview {
		border-color: var(--system-color-primary, #0a84ff);
	}

	.card {
		background: hsla(var(--system-color-dark-hsl), 0.06);
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.08);
		border-radius: 0.8rem;
		padding: 1rem 1.2rem;
		margin-bottom: 1rem;
		max-width: 32rem;
	}
	.card-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		font-size: 0.95rem;
	}
	.card-row > span:first-child {
		white-space: nowrap;
		flex-shrink: 0;
	}
	.accents {
		display: flex;
		gap: 0.6rem;
		flex-wrap: nowrap;
		justify-content: flex-end;
	}
	.swatch {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		border: 2px solid transparent;
		box-shadow: 0 0 0 1px hsla(0, 0%, 0%, 0.1);
	}
	.swatch.sel {
		border-color: hsla(var(--system-color-light-hsl), 1);
		box-shadow:
			0 0 0 2px var(--system-color-primary, #0a84ff),
			0 0 0 1px hsla(0, 0%, 0%, 0.1);
	}

	.switch {
		width: 2.6rem;
		height: 1.5rem;
		border-radius: 50px;
		background: hsla(var(--system-color-dark-hsl), 0.2);
		position: relative;
		transition: background 0.18s ease;
		flex: none;
	}
	.switch.on {
		background: var(--system-color-primary, #34c759);
	}
	.knob {
		position: absolute;
		top: 2px;
		left: 2px;
		width: calc(1.5rem - 4px);
		height: calc(1.5rem - 4px);
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 1px 3px hsla(0, 0%, 0%, 0.3);
		transition: transform 0.18s ease;
	}
	.switch.on .knob {
		transform: translateX(1.1rem);
	}

	.empty {
		color: hsla(var(--system-color-dark-hsl), 0.6);
	}
	.muted {
		font-size: 0.85rem;
		color: hsla(var(--system-color-dark-hsl), 0.45);
		margin-top: 0.3rem;
	}
</style>
