<script lang="ts">
	const {
		is_being_dragged
	}: {
		is_being_dragged: boolean;
	} = $props();
</script>

<section class="container">
	<header class="app-window-drag-handle"></header>

	<div class="placeholder">
		<div class="logo">⟨/⟩</div>
		<h1>Código</h1>
		<p>El editor de ArchMac llegará aquí.</p>
		<p class="muted">Prototipo visual — funcionalidad en construcción.</p>
	</div>
</section>

<style>
	.container {
		background-color: #202327;
		padding: 1px;

		border-radius: inherit;

		display: grid;
		grid-template-rows: auto 1fr;
	}

	.placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;

		border-radius: 0 0 0.75rem 0.75rem;

		color: #e6e6e6;
		text-align: center;
		padding: 2rem;
	}

	.logo {
		font-size: 3rem;
		font-weight: 700;
		color: #4aa3ff;
		margin-bottom: 0.5rem;
	}

	.placeholder h1 {
		font-size: 1.6rem;
		font-weight: 600;
	}

	.muted {
		color: #8a8f98;
		font-size: 0.9rem;
	}

	header {
		padding: 0.9rem;
	}

	:global(.tl-container.vscode) {
		top: 0.6rem;
		left: 0.6rem;
	}
</style>
