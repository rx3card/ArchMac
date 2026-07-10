<script lang="ts">
	import { apps } from '$lib/apps';
	import { wm } from '$lib/stores/windows.svelte';

	let { open = $bindable(false) }: { open: boolean } = $props();

	let query = $state('');
	let selected = $state(0);
	let input = $state<HTMLInputElement>();

	const results = $derived(
		query.trim() === ''
			? apps
			: apps.filter((a) => a.name.toLowerCase().includes(query.trim().toLowerCase()))
	);

	// Reinicia y enfoca al abrir.
	$effect(() => {
		if (open) {
			query = '';
			selected = 0;
			queueMicrotask(() => input?.focus());
		}
	});

	// Mantiene la selección dentro de rango cuando cambian los resultados.
	$effect(() => {
		if (selected >= results.length) selected = Math.max(0, results.length - 1);
	});

	function launch(i: number) {
		const app = results[i];
		if (!app) return;
		wm.open(app.id, app.name);
		open = false;
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			open = false;
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

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="backdrop" onclick={() => (open = false)}>
		<div
			class="panel"
			onclick={(e) => e.stopPropagation()}
			role="dialog"
			tabindex="-1"
			aria-label="Spotlight"
		>
			<div class="search">
				<span class="lens">⌕</span>
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
					{#each results as app, i}
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
						<li
							class="result"
							class:active={i === selected}
							onmouseenter={() => (selected = i)}
							onclick={() => launch(i)}
						>
							<img class="icon" src={app.icon} alt={app.name} draggable="false" />
							<span class="name">{app.name}</span>
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
		background: rgba(0, 0, 0, 0.15);
		z-index: 2000;
	}

	.panel {
		width: 560px;
		max-width: 90vw;
		background: var(--surface-strong);
		backdrop-filter: var(--blur-panel);
		-webkit-backdrop-filter: var(--blur-panel);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		overflow: hidden;
		animation: pop var(--dur-med) var(--ease-spring);
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
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		border-bottom: 1px solid var(--border);
	}

	.lens {
		font-size: var(--text-xl);
		color: var(--text-muted);
	}

	input {
		flex: 1;
		background: none;
		border: none;
		outline: none;
		color: var(--text);
		font-family: var(--font-sans);
		font-size: var(--text-xl);
		font-weight: var(--weight-regular);
	}
	input::placeholder {
		color: var(--text-muted);
	}

	.results {
		list-style: none;
		max-height: 320px;
		overflow-y: auto;
		padding: var(--space-2);
	}

	.result {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		cursor: default;
	}
	.result.active {
		background: var(--accent);
		color: #fff;
	}
	.result.active .kind {
		color: rgba(255, 255, 255, 0.8);
	}

	.icon {
		width: 28px;
		height: 28px;
		object-fit: contain;
		flex: none;
	}

	.name {
		flex: 1;
		font-size: var(--text-md);
		font-weight: var(--weight-medium);
	}

	.kind {
		font-size: var(--text-sm);
		color: var(--text-muted);
	}

	.empty {
		padding: var(--space-5);
		text-align: center;
		color: var(--text-muted);
		font-size: var(--text-md);
	}
</style>
