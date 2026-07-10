<script lang="ts">
	import { onMount } from 'svelte';
	import { go } from '$lib/state/screen.svelte.ts';
	import AppleIcon from '~icons/mdi/apple';
	import AdvancedIcon from '~icons/mdi/cog-sync-outline';
	import FirmwareIcon from '~icons/mdi/chip';
	import RestartIcon from '~icons/mdi/restart';
	import PowerIcon from '~icons/mdi/power';

	type Entry = { label: string; icon: 'archmac' | 'advanced' | 'firmware' | 'restart' | 'power'; action: () => void };

	const entries: Entry[] = [
		{ label: 'ArchMac GNU/Linux', icon: 'archmac', action: () => go('desktop') },
		{ label: 'Opciones avanzadas para ArchMac', icon: 'advanced', action: () => go('recovery') },
		{ label: 'Ajustes de Firmware UEFI', icon: 'firmware', action: () => {} },
		{ label: 'Reiniciar el equipo', icon: 'restart', action: () => location.reload() },
		{ label: 'Apagar el equipo', icon: 'power', action: () => go('poweroff') },
	];

	let selected = $state(0);
	let countdown = $state(5);
	let cancelled = $state(false);

	onMount(() => {
		const id = setInterval(() => {
			if (cancelled) return clearInterval(id);
			countdown -= 1;
			if (countdown <= 0) {
				clearInterval(id);
				entries[0].action();
			}
		}, 1000);
		return () => clearInterval(id);
	});

	const stop = () => (cancelled = true);

	function onKey(e: KeyboardEvent) {
		stop();
		if (e.key === 'ArrowDown') selected = (selected + 1) % entries.length;
		else if (e.key === 'ArrowUp') selected = (selected - 1 + entries.length) % entries.length;
		else if (e.key === 'Enter') entries[selected].action();
	}
</script>

<svelte:window onkeydown={onKey} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="firmware" onpointermove={stop}>
	<ul class="menu">
		{#each entries as entry, i}
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions, a11y_click_events_have_key_events -->
			<li
				class:active={i === selected}
				onmouseenter={() => ((selected = i), stop())}
				onclick={() => entry.action()}
			>
				<span class="icon">
					{#if entry.icon === 'archmac'}<AppleIcon />{:else if entry.icon === 'advanced'}<AdvancedIcon
						/>{:else if entry.icon === 'firmware'}<FirmwareIcon />{:else if entry.icon === 'restart'}<RestartIcon
						/>{:else}<PowerIcon />{/if}
				</span>
				<span class="label">{entry.label}</span>
			</li>
		{/each}
	</ul>

	<footer>
		{#if cancelled}
			Usa ↑ ↓ y Enter para elegir
		{:else}
			Arrancando ArchMac en {countdown} segundo{countdown === 1 ? '' : 's'}
		{/if}
	</footer>
</div>

<style>
	.firmware {
		position: fixed;
		inset: 0;
		z-index: 100000;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		background: #23262e;
		color: #d8dae0;
		font-family: var(--system-font-family, system-ui);
		user-select: none;
		overflow: hidden;
	}

	/* Formas suaves de fondo (estilo Archcraft) */
	.firmware::before,
	.firmware::after {
		content: '';
		position: absolute;
		border-radius: 45% 55% 60% 40% / 50% 45% 55% 50%;
		background: hsla(0, 0%, 100%, 0.025);
		pointer-events: none;
	}
	.firmware::before {
		width: 70vw;
		height: 70vw;
		top: -28vw;
		right: -22vw;
	}
	.firmware::after {
		width: 60vw;
		height: 60vw;
		bottom: -26vw;
		left: -18vw;
	}

	.menu {
		list-style: none;
		margin: 0;
		padding: 0;
		width: min(560px, 80vw);
		z-index: 1;
	}

	.menu li {
		display: flex;
		align-items: center;
		gap: 1rem;

		padding: 0.7rem 1.1rem;
		border-radius: 0.55rem;

		font-size: 0.95rem;
		color: hsla(0, 0%, 100%, 0.6);
		cursor: default;

		transition:
			background 0.12s ease,
			color 0.12s ease;
	}
	.menu li.active {
		background: hsla(0, 0%, 100%, 0.92);
		color: #1c1c1e;
		box-shadow: 0 6px 24px hsla(0, 0%, 0%, 0.35);
	}

	.icon {
		display: grid;
		place-items: center;
		width: 1.5rem;
	}
	.icon :global(svg) {
		font-size: 1.2rem;
	}
	.label {
		letter-spacing: 0.2px;
	}

	footer {
		position: absolute;
		bottom: 2.5rem;
		z-index: 1;

		color: hsla(0, 0%, 100%, 0.4);
		font-size: 0.85rem;
		letter-spacing: 0.3px;
	}
</style>
