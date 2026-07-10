<script lang="ts">
	import { apps_config } from '$lib/configs/apps/apps-config.ts';
	import { app_icon } from '$lib/helpers/asset-path.ts';
	import { open_app } from '$lib/helpers/open-app.ts';
	import { system } from '$lib/state/system.svelte.ts';
	import type { AppID } from '$lib/state/apps.svelte.ts';
	import MacSpotlight from '$lib/components/icons/MacSpotlight.svelte';

	type Item = { id: AppID; title: string; icon: string };

	const icon_for = (id: AppID) => apps_config[id].icon ?? app_icon(id);

	const all: Item[] = (Object.keys(apps_config) as AppID[])
		.filter((id) => id !== 'launchpad')
		.map((id) => ({ id, title: apps_config[id].title, icon: icon_for(id) }));

	let query = $state('');
	let selected = $state(0);
	let input = $state<HTMLInputElement>();

	const results = $derived(
		query.trim() === ''
			? all
			: all.filter((a) => a.title.toLowerCase().includes(query.trim().toLowerCase())),
	);

	$effect(() => {
		if (system.spotlight_open) {
			query = '';
			selected = 0;
			queueMicrotask(() => input?.focus());
		}
	});

	$effect(() => {
		if (selected >= results.length) selected = Math.max(0, results.length - 1);
	});

	function launch(i: number) {
		const item = results[i];
		if (!item) return;
		open_app(item.id);
		system.spotlight_open = false;
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			system.spotlight_open = false;
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			selected = (selected + 1) % results.length;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selected = (selected - 1 + results.length) % results.length;
		} else if (e.key === 'Enter') {
			e.preventDefault();
			launch(selected);
		}
	}
</script>

{#if system.spotlight_open}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="backdrop" onclick={() => (system.spotlight_open = false)}>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="panel" role="dialog" tabindex="-1" onclick={(e) => e.stopPropagation()}>
			<div class="search">
				<span class="lens"><MacSpotlight /></span>
				<input
					bind:this={input}
					bind:value={query}
					onkeydown={onKey}
					placeholder="Spotlight — buscar apps"
					spellcheck="false"
				/>
			</div>

			{#if results.length > 0}
				<ul class="results">
					{#each results as item, i}
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
						<li
							class="result"
							class:active={i === selected}
							onmouseenter={() => (selected = i)}
							onclick={() => launch(i)}
						>
							<img src={item.icon} alt={item.title} draggable="false" />
							<span class="name">{item.title}</span>
							<span class="kind">Aplicación</span>
						</li>
					{/each}
				</ul>
			{:else}
				<div class="empty">Sin resultados para “{query}”</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding-top: 18vh;
		background: hsla(0, 0%, 0%, 0.12);
		z-index: 10000;
	}

	.panel {
		width: 560px;
		max-width: 90vw;
		background: hsla(var(--system-color-light-hsl), 0.7);
		backdrop-filter: blur(30px) saturate(180%);
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.1);
		border-radius: 0.9rem;
		box-shadow: 0 20px 60px hsla(0, 0%, 0%, 0.35);
		overflow: hidden;
		color: var(--system-color-dark);
		animation: pop 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.96) translateY(-8px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.search {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid hsla(var(--system-color-dark-hsl), 0.1);
	}

	.lens {
		display: grid;
		place-items: center;
		font-size: 1.35rem;
		color: hsla(var(--system-color-dark-hsl), 0.5);
	}

	input:focus,
	input:focus-visible {
		box-shadow: none;
	}

	input {
		flex: 1;
		background: none;
		border: none;
		outline: none;
		color: var(--system-color-dark);
		font-family: var(--system-font-family);
		font-size: 1.5rem;
		font-weight: 400;
	}
	input::placeholder {
		color: hsla(var(--system-color-dark-hsl), 0.4);
	}

	.results {
		list-style: none;
		max-height: 340px;
		overflow-y: auto;
		padding: 0.5rem;
		margin: 0;
	}

	.result {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
		cursor: default;
	}
	.result.active {
		background: var(--system-color-primary, #0a84ff);
		color: #fff;
	}
	.result.active .kind {
		color: hsla(0, 0%, 100%, 0.8);
	}

	.result img {
		width: 28px;
		height: 28px;
		object-fit: contain;
		flex: none;
	}

	.name {
		flex: 1;
		font-size: 1rem;
		font-weight: 500;
	}

	.kind {
		font-size: 0.85rem;
		color: hsla(var(--system-color-dark-hsl), 0.5);
	}

	.empty {
		padding: 1.5rem;
		text-align: center;
		color: hsla(var(--system-color-dark-hsl), 0.5);
	}
</style>
