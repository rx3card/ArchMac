<script lang="ts">
	import { apps_config } from '$lib/configs/apps/apps-config.ts';
	import type { AppID } from '$lib/state/apps.svelte.ts';

	const { app_id }: { app_id: AppID } = $props();

	const title = apps_config[app_id].title;
</script>

<section class="container">
	<header class="titlebar app-window-drag-handle">
		<span>{title}</span>
	</header>

	<div class="body">
		<img src="/app-icons/{app_id}/256.png" alt={title} draggable="false" />
		<h1>{title}</h1>
		<p>Esta app de ArchMac está en construcción.</p>
		<p class="muted">Prototipo visual — pronto tendrá contenido real.</p>
	</div>
</section>

<style>
	.container {
		display: grid;
		grid-template-rows: 2.5rem 1fr;

		height: 100%;

		border-radius: inherit;

		background-color: var(--system-color-light);
		color: var(--system-color-dark);
	}

	.titlebar {
		display: flex;
		align-items: center;
		justify-content: center;

		border-bottom: 1px solid hsla(var(--system-color-dark-hsl), 0.1);

		user-select: none;

		span {
			font-size: 0.85rem;
			font-weight: 500;
			color: hsla(var(--system-color-dark-hsl), 0.8);
		}
	}

	.body {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;

		padding: 2rem;
		text-align: center;

		img {
			width: 96px;
			height: 96px;
			filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
			margin-bottom: 0.5rem;
		}

		h1 {
			font-size: 1.4rem;
			font-weight: 600;
		}

		p {
			color: hsla(var(--system-color-dark-hsl), 0.7);
		}

		.muted {
			font-size: 0.85rem;
			color: hsla(var(--system-color-dark-hsl), 0.45);
		}
	}
</style>
