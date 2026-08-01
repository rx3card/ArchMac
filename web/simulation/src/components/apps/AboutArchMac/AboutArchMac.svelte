<script lang="ts">
	import { preferences } from '$lib/state/preferences.svelte.ts';
	import BlogIcon from '~icons/mdi/grease-pencil';
	import WorksIcon from '~icons/ic/round-workspaces';
	import GithubIcon from '~icons/mdi/github';
</script>

<section class="container">
	<header class="titlebar app-window-drag-handle">
		<span>Acerca de ArchMac</span>
	</header>

	<aside class:light={preferences.theme.scheme === 'light'}>
		<nav>
			<a href="#proyecto"> <WorksIcon /> Proyecto </a>
			<a href="#notas"> <BlogIcon /> Notas </a>

			<hr />

			<a href="#codigo"> <GithubIcon /> Código </a>
		</nav>
	</aside>

	<section class="content">
		<div class="logo">ArchMac</div>

		<br />

		<h1>Hola, soy ArchMac</h1>

		<h2>Una experiencia de escritorio premium inspirada en macOS, sobre Linux.</h2>

		<br /><br />

		<p>
			ArchMac es una distribución basada en Arch Linux, rediseñada desde cero para máxima
			velocidad, eficiencia y elegancia. Wayland, Hyprland y una interfaz minimalista y coherente.
		</p>

		<br /><br />

		<p>
			Esto que ves es el prototipo visual: validamos el look &amp; feel en la web antes de llevarlo
			al escritorio nativo y empaquetarlo en una ISO.
		</p>
	</section>
</section>

<style>
	.container {
		--color: var(--system-color-light-hsl);

		display: grid;
		grid-template-columns: 12rem 1fr;
		grid-template-rows: 3rem 1fr;

		border-radius: inherit;

		background-image: linear-gradient(
			to right,
			hsla(var(--color), 0.7) 12rem,
			hsla(var(--color), 1) 12rem 100%
		);

		transition: --color 200ms ease-in;

		color: var(--system-color-dark);
	}

	.titlebar {
		grid-area: 1 / 1 / span 1 / span 2;

		display: flex;
		justify-content: center;

		z-index: 1;

		padding: 0.9rem 1rem;

		width: 100%;

		border-top-left-radius: inherit;
		border-top-right-radius: inherit;

		user-select: none;

		span {
			color: hsla(var(--system-color-dark-hsl), 0.8);
			font-weight: 500;
			font-size: 0.9rem;
			letter-spacing: 0.5px;
		}
	}

	aside {
		grid-area: 1 / 1 / span 2 / span 1;

		transform: translateZ(0);

		height: calc(100% - 2.7px);
		width: calc(12rem - 2.27px);

		margin: 1.8px 0 0px 1.8px;

		border-top-left-radius: 0.5rem;
		border-bottom-left-radius: inherit;

		&::before {
			content: '';

			width: inherit;
			height: inherit;

			border-radius: inherit;

			position: fixed;
			left: 0;
			top: 0;

			z-index: -1;
			backdrop-filter: blur(12px);
		}

		&.light {
			height: calc(100% - 3px);
			width: calc(12rem - 2.5px);

			margin: 1.7px 0 0px 1.7px;

			border-top-left-radius: 0.5rem;
			border-bottom-left-radius: 0.5rem;
		}

		nav {
			display: flex;
			flex-direction: column;
			gap: 0.2rem;

			margin: 4rem 0.6rem;

			hr {
				display: block;

				width: 100%;
				height: 1px;

				background-color: hsla(var(--system-color-dark-hsl), 0.2);

				border: none;
			}

			a {
				display: flex;
				gap: 0.4rem;
				align-items: center;

				color: hsla(var(--system-color-dark-hsl), 0.9);
				text-decoration: none;
				font-weight: 400;

				padding: 0.5rem 0.5rem;

				border-radius: 0.4rem;

				transition: background-color 100ms ease;

				&:hover {
					background-color: hsla(var(--system-color-dark-hsl), 0.2);
				}
			}
		}
	}

	.content {
		grid-area: 2 / 2 / span 1 / span 1;

		display: flex;
		flex-direction: column;
		align-items: center;

		padding: 1rem;
	}

	.logo {
		display: grid;
		place-items: center;

		height: 160px;
		width: 160px;

		border-radius: 50%;

		background-image: linear-gradient(135deg, #0a84ff, #5e5ce6);

		color: #fff;
		font-size: 1.6rem;
		font-weight: 700;
		letter-spacing: -0.5px;

		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.28);
	}

	h1 {
		font-size: 2.618rem;
		line-height: 1.618;
	}

	h2 {
		font-size: 1.618rem;
		line-height: 1.2;
	}

	p {
		line-height: 1.618rem;
	}
</style>
