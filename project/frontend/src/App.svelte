<script lang="ts">
	import Desktop from './components/Desktop/Desktop.svelte';
	import UefiBoot from './components/Boot/UefiBoot.svelte';
	import Recovery from './components/Recovery/Recovery.svelte';
	import { screen, go } from '$lib/state/screen.svelte.ts';
</script>

{#if screen.current === 'desktop'}
	<Desktop />
{:else if screen.current === 'uefi'}
	<UefiBoot />
{:else if screen.current === 'recovery'}
	<Recovery />
{:else if screen.current === 'poweroff'}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="poweroff" onclick={() => go('uefi')}>
		<button class="power" aria-label="Encender" onclick={() => go('uefi')}>⏻</button>
		<span>Pulsa el botón de encendido</span>
	</div>
{/if}

<style>
	.poweroff {
		position: fixed;
		inset: 0;
		z-index: 100000;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;

		background: #000;
		color: hsla(0, 0%, 100%, 0.6);
		font-family: var(--system-font-family, system-ui);
		user-select: none;
		cursor: pointer;
	}
	.power {
		width: 5rem;
		height: 5rem;
		border-radius: 50%;
		border: 2px solid hsla(0, 0%, 100%, 0.3);
		color: hsla(0, 0%, 100%, 0.8);
		font-size: 2rem;
		transition: all 0.2s ease;
	}
	.power:hover {
		border-color: #fff;
		color: #fff;
		box-shadow: 0 0 30px hsla(0, 0%, 100%, 0.3);
	}
</style>
