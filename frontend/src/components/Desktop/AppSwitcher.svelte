<script lang="ts">
	import { apps_config } from '$lib/configs/apps/apps-config.ts';
	import { system } from '$lib/state/system.svelte.ts';
	import { switcher, switcher_commit } from '$lib/state/switcher.svelte.ts';

	let timer: ReturnType<typeof setTimeout>;

	// Tras una pausa de inactividad, confirma (para el caso del swipe sin tecla modificadora).
	$effect(() => {
		if (!system.switcher_open) return;
		switcher.index; // dependencia: reinicia el temporizador al cambiar de selección
		clearTimeout(timer);
		timer = setTimeout(() => switcher_commit(), 1100);
		return () => clearTimeout(timer);
	});
</script>

{#if system.switcher_open && switcher.items.length > 0}
	<div class="overlay">
		<div class="bar">
			{#each switcher.items as id, i}
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<div
					class="item"
					class:active={i === switcher.index}
					onmouseenter={() => (switcher.index = i)}
					onclick={() => switcher_commit()}
				>
					<img src="/app-icons/{id}/256.png" alt={apps_config[id].title} draggable="false" />
				</div>
			{/each}
		</div>
		<div class="label">{apps_config[switcher.items[switcher.index]].title}</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 11000;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;

		pointer-events: none;
	}

	.bar {
		display: flex;
		align-items: center;
		gap: 0.75rem;

		max-width: 90vw;
		padding: 1rem 1.25rem;

		background: hsla(var(--system-color-dark-hsl), 0.45);
		backdrop-filter: blur(30px) saturate(160%);
		border: 1px solid hsla(var(--system-color-light-hsl), 0.2);
		border-radius: 1.1rem;
		box-shadow: 0 20px 60px hsla(0, 0%, 0%, 0.4);

		pointer-events: auto;
	}

	.item {
		display: grid;
		place-items: center;

		padding: 0.4rem;
		border-radius: 0.8rem;

		cursor: pointer;

		img {
			width: 4rem;
			height: 4rem;
			object-fit: contain;
		}

		&.active {
			background: hsla(var(--system-color-light-hsl), 0.25);
		}
	}

	.label {
		padding: 0.25rem 0.9rem;

		background: hsla(var(--system-color-dark-hsl), 0.45);
		backdrop-filter: blur(20px);
		border-radius: 0.5rem;

		color: #fff;
		font-size: 0.95rem;
		font-weight: 500;
	}
</style>
