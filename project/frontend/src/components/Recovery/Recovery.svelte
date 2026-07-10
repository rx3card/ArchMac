<script lang="ts">
	import { go } from '$lib/state/screen.svelte.ts';
	import { open_app } from '$lib/helpers/open-app.ts';
	import AppleIcon from '~icons/mdi/apple';
	import ReinstallIcon from '~icons/mdi/download-circle-outline';
	import DiskUtilIcon from '~icons/mdi/harddisk-plus';
	import TerminalIcon from '~icons/mdi/console';
	import RestoreIcon from '~icons/mdi/backup-restore';

	type Option = { id: string; label: string; icon: 'reinstall' | 'disk' | 'terminal' | 'restore' };

	const options: Option[] = [
		{ id: 'reinstall', label: 'Reinstalar ArchMac', icon: 'reinstall' },
		{ id: 'disk', label: 'Utilidad de Discos', icon: 'disk' },
		{ id: 'terminal', label: 'Terminal', icon: 'terminal' },
		{ id: 'restore', label: 'Restaurar desde copia', icon: 'restore' },
	];

	let selected = $state(0);

	function activate(id: string) {
		if (id === 'reinstall') {
			go('desktop');
			open_app('install');
		}
		// las demás son simuladas (sin acción real en el prototipo)
	}
</script>

<div class="recovery">
	<div class="menubar">
		<AppleIcon />
		<span class="title">Utilidades de ArchMac</span>
		<span class="spacer"></span>
		<button class="restart" onclick={() => go('uefi')}>Reiniciar</button>
	</div>

	<div class="center">
		<section class="utilities">
			<header>
				<div class="logo"><AppleIcon /></div>
				<h1>Recovery de ArchMac</h1>
				<p>Selecciona una opción para continuar</p>
			</header>

			<ul>
				{#each options as opt, i}
					<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
					<li
						class:active={i === selected}
						onmouseenter={() => (selected = i)}
						ondblclick={() => activate(opt.id)}
						onclick={() => (selected = i)}
					>
						<span class="icon">
							{#if opt.icon === 'reinstall'}<ReinstallIcon />{:else if opt.icon === 'disk'}<DiskUtilIcon
								/>{:else if opt.icon === 'terminal'}<TerminalIcon />{:else}<RestoreIcon />{/if}
						</span>
						<span class="label">{opt.label}</span>
					</li>
				{/each}
			</ul>

			<footer>
				<button class="continue" onclick={() => activate(options[selected].id)}>Continuar</button>
			</footer>
		</section>
	</div>
</div>

<style>
	.recovery {
		position: fixed;
		inset: 0;
		z-index: 100000;

		display: flex;
		flex-direction: column;

		background:
			radial-gradient(circle at 50% 30%, #3a3f4b, #1a1c23 75%),
			#14151b;
		color: #fff;
		font-family: var(--system-font-family, system-ui);
		user-select: none;
	}

	.menubar {
		display: flex;
		align-items: center;
		gap: 0.7rem;

		height: 1.8rem;
		padding: 0 0.9rem;

		background: hsla(0, 0%, 100%, 0.08);
		backdrop-filter: blur(12px);
		font-size: 0.85rem;
	}
	.menubar :global(svg) {
		font-size: 1rem;
	}
	.menubar .title {
		font-weight: 600;
	}
	.menubar .spacer {
		flex: 1;
	}
	.menubar .restart {
		color: #fff;
		opacity: 0.85;
	}
	.menubar .restart:hover {
		opacity: 1;
	}

	.center {
		flex: 1;
		display: grid;
		place-items: center;
	}

	.utilities {
		width: 420px;

		background: hsla(var(--system-color-light-hsl, 0 0% 100%), 0.85);
		backdrop-filter: blur(40px) saturate(180%);
		border: 1px solid hsla(0, 0%, 100%, 0.2);
		border-radius: 1rem;
		box-shadow: 0 30px 80px hsla(0, 0%, 0%, 0.5);

		color: #1c1c1e;

		padding: 1.5rem;
	}

	.utilities header {
		text-align: center;
		margin-bottom: 1.25rem;
	}
	.logo {
		display: grid;
		place-items: center;
		margin-bottom: 0.5rem;
	}
	.logo :global(svg) {
		font-size: 2.5rem;
		color: #1c1c1e;
	}
	.utilities h1 {
		font-size: 1.3rem;
		font-weight: 600;
	}
	.utilities header p {
		color: hsla(0, 0%, 0%, 0.55);
		font-size: 0.9rem;
		margin-top: 0.2rem;
	}

	.utilities ul {
		list-style: none;
		margin: 0;
		padding: 0;
		border-radius: 0.6rem;
		overflow: hidden;
		border: 1px solid hsla(0, 0%, 0%, 0.08);
	}
	.utilities li {
		display: flex;
		align-items: center;
		gap: 0.8rem;

		padding: 0.7rem 0.9rem;
		cursor: default;
		border-bottom: 1px solid hsla(0, 0%, 0%, 0.06);
	}
	.utilities li:last-child {
		border-bottom: none;
	}
	.utilities li.active {
		background: var(--system-color-primary, #0a84ff);
		color: #fff;
	}
	.icon {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
	}
	.icon :global(svg) {
		font-size: 1.4rem;
	}
	.label {
		font-size: 0.95rem;
		font-weight: 500;
	}

	.utilities footer {
		display: flex;
		justify-content: flex-end;
		margin-top: 1.25rem;
	}
	.continue {
		background: var(--system-color-primary, #0a84ff);
		color: #fff;
		font-weight: 600;
		padding: 0.5rem 1.4rem;
		border-radius: 0.5rem;
	}
	.continue:hover {
		filter: brightness(1.08);
	}
</style>
