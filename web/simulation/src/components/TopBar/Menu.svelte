<script lang="ts">
	import { preferences } from '$lib/state/preferences.svelte.ts';
	import { menubar_state } from '$lib/state/menubar.svelte.ts';
	import { go } from '$lib/state/screen.svelte.ts';
	import { open_app } from '$lib/helpers/open-app.ts';

	const { menu }: { menu: any } = $props();

	// Acciones del sistema (menú Apple) que navegan entre pantallas o abren apps.
	function handle(key: string) {
		menubar_state.active = '';
		switch (key) {
			case 'install-archmac':
				go('desktop');
				return open_app('install');
			case 'recovery':
				return go('recovery');
			case 'restart':
			case 'lock-screen':
				return go('uefi');
			case 'shutdown':
				return go('poweroff');
			case 'about-this-mac':
				return open_app('about-archmac');
			case 'system-preferences':
				return open_app('system-preferences');
			case 'app-store':
				return open_app('appstore');
		}
	}
</script>

<section class="container" class:dark={preferences.theme.scheme === 'dark'}>
	{#each Object.entries(menu) as Array<[any, any]> as [key, val]}
		<button class="menu-item" disabled={val.disabled} onclick={() => handle(key)}>
			{val.title}
		</button>
		{#if val.breakAfter}
			<div class="divider"></div>
		{/if}
	{/each}
</section>

<style>
	.container {
		/* // Initial invisible border */
		--additional-box-shadow: 0 0 0 0 white;

		display: block;

		min-width: 16rem;
		width: max-content;

		padding: 0.5rem;

		position: relative;

		user-select: none;

		background-color: hsla(var(--system-color-light-hsl), 0.3);
		backdrop-filter: blur(25px);

		border-radius: 0.5rem;

		box-shadow:
			hsla(0, 0%, 0%, 0.3) 0px 0px 11px 0px,
			var(--additional-box-shadow);

		&.dark {
			--additional-box-shadow: inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
				0 0 0 1.2px hsla(var(--system-color-light-hsl), 0.3);
		}
	}

	.menu-item {
		--alpha: 1;

		display: flex;
		justify-content: flex-start;

		width: 100%;

		padding: 0.2rem 0.4rem;
		margin: 0.1rem;

		letter-spacing: 0.4px;
		font-weight: 400 !important;
		font-size: 0.9rem !important;

		border-radius: 0.3rem;

		transition: none;

		color: hsla(var(--system-color-dark-hsl), var(--alpha));

		&:disabled {
			--alpha: 0.5;
		}

		&:not(:disabled) {
			&:hover,
			&:focus-visible {
				background-color: var(--system-color-primary);
				color: var(--system-color-primary-contrast);
				font-weight: 500 !important;
			}
		}
	}

	.divider {
		width: 100%;
		height: 0.2px;

		background-color: hsla(var(--system-color-dark-hsl), 0.3);

		margin: 2px 0;
	}
</style>
