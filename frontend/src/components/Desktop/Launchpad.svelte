<script lang="ts">
	import { apps_config } from '$lib/configs/apps/apps-config.ts';
	import { open_app } from '$lib/helpers/open-app.ts';
	import { system } from '$lib/state/system.svelte.ts';
	import type { AppID } from '$lib/state/apps.svelte.ts';
	import MacSpotlight from '$lib/components/icons/MacSpotlight.svelte';

	type Item = { id: AppID; title: string; icon: string };

	const icon_for = (id: AppID) => apps_config[id].icon ?? `/app-icons/${id}/256.png`;

	const all: Item[] = (Object.keys(apps_config) as AppID[])
		.filter((id) => id !== 'launchpad')
		.map((id) => ({ id, title: apps_config[id].title, icon: icon_for(id) }));

	let query = $state('');
	const results = $derived(
		query.trim() === ''
			? all
			: all.filter((a) => a.title.toLowerCase().includes(query.trim().toLowerCase())),
	);

	let input = $state<HTMLInputElement>();
	$effect(() => {
		if (system.launchpad_open) {
			query = '';
			queueMicrotask(() => input?.focus());
		}
	});

	function launch(id: AppID) {
		open_app(id);
		system.launchpad_open = false;
	}
</script>

{#if system.launchpad_open}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div
		class="overlay"
		role="dialog"
		tabindex="-1"
		onclick={() => (system.launchpad_open = false)}
		onkeydown={(e) => e.key === 'Escape' && (system.launchpad_open = false)}
	>
		<div class="search-row">
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="search" onclick={(e) => e.stopPropagation()}>
				<span class="lens"><MacSpotlight /></span>
				<input bind:this={input} bind:value={query} placeholder="Buscar" spellcheck="false" />
			</div>
		</div>

		<div class="grid">
			{#each results as item (item.id)}
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<div class="app" onclick={(e) => (e.stopPropagation(), launch(item.id))}>
					<img src={item.icon} alt={item.title} draggable="false" />
					<span>{item.title}</span>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 9000;

		display: flex;
		flex-direction: column;
		align-items: center;

		padding: 4rem 2rem 2rem;

		background: hsla(var(--system-color-dark-hsl), 0.25);
		backdrop-filter: blur(40px) saturate(160%);

		animation: fade 0.25s ease-out;
	}

	@keyframes fade {
		from {
			opacity: 0;
			backdrop-filter: blur(0);
		}
		to {
			opacity: 1;
		}
	}

	.search-row {
		display: flex;
		justify-content: center;
		margin-bottom: 3rem;
	}

	.search {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		width: 320px;
		padding: 0.4rem 0.9rem;

		background: hsla(var(--system-color-light-hsl), 0.25);
		border: 1px solid hsla(var(--system-color-light-hsl), 0.3);
		border-radius: 0.6rem;

		color: #fff;

		.lens {
			display: grid;
			place-items: center;
			font-size: 1.05rem;
			opacity: 0.85;
		}

		input {
			flex: 1;
			background: none;
			border: none;
			outline: none;
			color: #fff;
			font-family: var(--system-font-family);
			font-size: 1rem;
			text-align: center;
		}
		input:focus,
		input:focus-visible {
			box-shadow: none;
		}
		input::placeholder {
			color: hsla(0, 0%, 100%, 0.7);
		}
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, 7rem);
		justify-content: center;
		gap: 2rem 1.5rem;

		width: 100%;
		max-width: 1100px;
	}

	.app {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;

		cursor: pointer;

		animation: pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;

		img {
			width: 5rem;
			height: 5rem;
			object-fit: contain;
			filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.35));
			transition: transform 0.12s ease-out;
		}

		span {
			color: #fff;
			font-size: 0.85rem;
			text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
		}

		&:hover img {
			transform: scale(1.08);
		}
	}

	@keyframes pop-in {
		from {
			opacity: 0;
			transform: scale(0.8);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
