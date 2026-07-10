<script lang="ts">
	import readme from '../README.md?raw';
	import plan from '../PLAN.md?raw';
	import requirements from '../REQUISITOS.md?raw';
	import fidelity from '../DESIGN-FIDELITY.md?raw';
	import software from '../SOFTWARE.md?raw';
	import context from '../CONTEXT.md?raw';

	const SIM_URL = '/frontend/';

	type DocId = 'readme' | 'plan' | 'requirements' | 'fidelity' | 'software' | 'context';

	const pillars = [
		{
			label: 'Base',
			title: 'Arch Linux, no un kernel nuevo',
			text: 'ArchMac toma la base robusta de Arch, pacman, systemd y el ecosistema Linux. El proyecto se concentra donde realmente cambia la experiencia: el escritorio, el instalador y la identidad.',
		},
		{
			label: 'Shell',
			title: 'Hyprland + AGS/Astal',
			text: 'La distro real se construye sobre Wayland/Hyprland, con barra superior, dock, centro de control, launcher y notificaciones en un shell nativo, no en un navegador empacado.',
		},
		{
			label: 'Experiencia',
			title: 'Mac-like, con identidad propia',
			text: 'El objetivo no es clonar macOS: es capturar su fluidez, coherencia y cuidado visual, sustituyendo los activos provisionales por marca, iconos y wallpapers propios de ArchMac.',
		},
	];

	const modules = [
		['Dock', 'Magnificación, rebote, indicadores de apps y una transición visual consistente con el escritorio.'],
		['Ventanas', 'Arrastre, resize en bordes, foco, maximizado fluido y minimizado con efecto genie por malla/canvas.'],
		['Spotlight', 'Búsqueda rápida y apertura de apps desde teclado, pensada como el centro de navegación diario.'],
		['Centro de Control', 'Brillo, sonido, tema, acento y toggles del sistema reunidos en una superficie compacta.'],
		['Recovery', 'Arranque UEFI, recuperación y flujo de reinstalación para que el SO se sienta completo desde el primer segundo.'],
		['ArchMacInstall', 'Instalador gráfico por pasos: idioma, disco, usuario, resumen, instalación y reinicio.'],
	];

	const roadmap = [
		{
			phase: '01',
			title: 'Laboratorio web',
			state: 'Activo',
			text: 'La simulación en /frontend define la sensación: desktop, ventanas, dock, apps, arranque, recovery e instalador.',
		},
		{
			phase: '02',
			title: 'Shell nativo',
			state: 'Siguiente',
			text: 'Portar la experiencia a Hyprland + AGS/Astal: barra, dock, control center, launcher, notificaciones y lockscreen.',
		},
		{
			phase: '03',
			title: 'ISO instalable',
			state: 'Planificado',
			text: 'Empaquetar ArchMac con archiso, paquetes propios, dotfiles, branding y un instalador reproducible.',
		},
		{
			phase: '04',
			title: 'Daily driver',
			state: 'Meta',
			text: 'Usarlo en una máquina real, medir consumo, pulir fricción y convertir el prototipo en una distro confiable.',
		},
	];

	const stats = [
		['Stack real', 'Arch + Hyprland + AGS'],
		['Prototipo', 'Svelte 5 + Vite'],
		['Objetivo idle', '< 800 MB RAM'],
		['Entrega', 'ISO booteable'],
	];

	const docs = [
		{
			id: 'readme',
			title: 'Visión',
			file: 'README.md',
			description: 'Qué es ArchMac, cómo se organiza el repo y estado del prototipo.',
			content: readme,
		},
		{
			id: 'plan',
			title: 'Plan maestro',
			file: 'PLAN.md',
			description: 'Principios, arquitectura, fases, riesgos y estructura objetivo.',
			content: plan,
		},
		{
			id: 'requirements',
			title: 'Requisitos',
			file: 'REQUISITOS.md',
			description: 'Requisitos funcionales y no funcionales del escritorio simulado.',
			content: requirements,
		},
		{
			id: 'fidelity',
			title: 'Fidelidad visual',
			file: 'DESIGN-FIDELITY.md',
			description: 'Brechas de fidelidad, eras de macOS y detalles visuales por pulir.',
			content: fidelity,
		},
		{
			id: 'software',
			title: 'Distro real',
			file: 'SOFTWARE.md',
			description: 'Cómo pasar del prototipo a una distribución Arch instalable.',
			content: software,
		},
		{
			id: 'context',
			title: 'Contexto',
			file: 'CONTEXT.md',
			description: 'Handoff completo del proyecto, decisiones y gotchas técnicos.',
			content: context,
		},
	] satisfies Array<{
		id: DocId;
		title: string;
		file: string;
		description: string;
		content: string;
	}>;

	let activeDoc: DocId = 'software';

	$: selectedDoc = docs.find((doc) => doc.id === activeDoc) ?? docs[0];
	$: selectedDocHtml = markdownToHtml(selectedDoc.content);
	$: selectedDocHref = `data:text/markdown;charset=utf-8,${encodeURIComponent(selectedDoc.content)}`;

	function escapeHtml(value: string) {
		return value
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;')
			.replaceAll("'", '&#039;');
	}

	function inlineMarkdown(value: string) {
		return escapeHtml(value)
			.replace(/`([^`]+)`/g, '<code>$1</code>')
			.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
			.replace(/\*([^*]+)\*/g, '<em>$1</em>')
			.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
	}

	function markdownToHtml(markdown: string) {
		const lines = markdown.replace(/\r\n/g, '\n').split('\n');
		const html: string[] = [];
		let inCode = false;
		let inList = false;
		let inOrderedList = false;
		let inTable = false;

		const closeLists = () => {
			if (inList) {
				html.push('</ul>');
				inList = false;
			}
			if (inOrderedList) {
				html.push('</ol>');
				inOrderedList = false;
			}
		};

		const closeTable = () => {
			if (inTable) {
				html.push('</tbody></table>');
				inTable = false;
			}
		};

		for (const rawLine of lines) {
			const line = rawLine.trimEnd();

			if (line.startsWith('```')) {
				closeLists();
				closeTable();
				if (!inCode) {
					html.push('<pre><code>');
					inCode = true;
				} else {
					html.push('</code></pre>');
					inCode = false;
				}
				continue;
			}

			if (inCode) {
				html.push(`${escapeHtml(rawLine)}\n`);
				continue;
			}

			if (!line.trim()) {
				closeLists();
				closeTable();
				continue;
			}

			if (/^\|.+\|$/.test(line)) {
				closeLists();
				const cells = line
					.split('|')
					.slice(1, -1)
					.map((cell) => cell.trim());

				if (cells.every((cell) => /^:?-{3,}:?$/.test(cell))) {
					continue;
				}

				if (!inTable) {
					html.push('<table><tbody>');
					inTable = true;
				}
				html.push(`<tr>${cells.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join('')}</tr>`);
				continue;
			}

			closeTable();

			const heading = line.match(/^(#{1,4})\s+(.*)$/);
			if (heading) {
				closeLists();
				const level = Math.min(heading[1].length + 1, 5);
				html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
				continue;
			}

			if (line.startsWith('> ')) {
				closeLists();
				html.push(`<blockquote>${inlineMarkdown(line.slice(2))}</blockquote>`);
				continue;
			}

			const unordered = line.match(/^[-*]\s+(.*)$/);
			if (unordered) {
				if (inOrderedList) {
					html.push('</ol>');
					inOrderedList = false;
				}
				if (!inList) {
					html.push('<ul>');
					inList = true;
				}
				html.push(`<li>${inlineMarkdown(unordered[1])}</li>`);
				continue;
			}

			const ordered = line.match(/^\d+\.\s+(.*)$/);
			if (ordered) {
				if (inList) {
					html.push('</ul>');
					inList = false;
				}
				if (!inOrderedList) {
					html.push('<ol>');
					inOrderedList = true;
				}
				html.push(`<li>${inlineMarkdown(ordered[1])}</li>`);
				continue;
			}

			closeLists();
			html.push(`<p>${inlineMarkdown(line)}</p>`);
		}

		closeLists();
		closeTable();
		if (inCode) html.push('</code></pre>');

		return html.join('');
	}
</script>

<svelte:head>
	<title>ArchMac - Sistema operativo basado en Arch</title>
	<meta
		name="description"
		content="ArchMac es una distribución Linux basada en Arch con escritorio premium inspirado en macOS, simulación web, documentación técnica y ruta hacia una ISO instalable."
	/>
</svelte:head>

<header class="site-header">
	<a class="brand" href="#top" aria-label="ArchMac">
		<img src="/favicon.svg" alt="" />
		<span>ArchMac</span>
	</a>
	<nav aria-label="Navegación principal">
		<a href="#sistema">Sistema</a>
		<a href="#simulacion">Simulación</a>
		<a href="#ruta">Ruta</a>
		<a href="#documentacion">Docs</a>
	</nav>
	<a class="header-action" href={SIM_URL}>Abrir /frontend</a>
</header>

<main id="top">
	<section class="hero" aria-labelledby="hero-title">
		<div class="hero-copy">
			<p class="eyebrow">Arch Linux vestido como un sistema propio</p>
			<h1 id="hero-title">ArchMac</h1>
			<p class="hero-line">
				Una distribución Linux basada en Arch que busca la fluidez visual de macOS sin
				convertirse en un clon: Wayland, Hyprland, shell propio, instalador gráfico y una
				identidad que se está diseñando desde el prototipo.
			</p>
			<div class="hero-actions">
				<a class="primary-action" href={SIM_URL}>Entrar a la simulación</a>
				<a class="secondary-action" href="#documentacion">Leer documentación</a>
			</div>
		</div>

		<a class="hero-screen" href={SIM_URL} aria-label="Abrir simulación de ArchMac">
			<img src="/screenshots/desktop-light.png" alt="Escritorio simulado de ArchMac" />
			<div class="screen-caption">
				<span>Live preview</span>
				<strong>/frontend</strong>
			</div>
		</a>
	</section>

	<section id="sistema" class="section">
		<div class="section-intro">
			<p class="eyebrow">Qué es realmente</p>
			<h2>Una distro, no una fantasía de kernel.</h2>
			<p>
				ArchMac no intenta reescribir Linux. Toma Arch como cimiento y construye encima una
				experiencia completa: composición, shell, branding, instalador, actualizaciones y
				documentación para llegar a una ISO instalable.
			</p>
		</div>

		<div class="pillar-grid">
			{#each pillars as pillar}
				<article class="pillar-card">
					<span>{pillar.label}</span>
					<h3>{pillar.title}</h3>
					<p>{pillar.text}</p>
				</article>
			{/each}
		</div>
	</section>

	<section class="section system-map" aria-labelledby="architecture-title">
		<div class="map-copy">
			<p class="eyebrow">Arquitectura objetivo</p>
			<h2 id="architecture-title">Del prototipo al escritorio nativo.</h2>
			<p>
				La web define la sensación. El sistema real la porta a componentes nativos sobre
				Hyprland: menos peso, más control y una ruta clara hacia paquetes, archiso y VM de
				pruebas.
			</p>
		</div>

		<div class="stack-diagram" aria-label="Capas de ArchMac">
			<div>Apps + ajustes ArchMac</div>
			<div>Shell AGS/Astal</div>
			<div>Hyprland / Wayland</div>
			<div>Arch Linux</div>
			<div>Kernel Linux</div>
		</div>
	</section>

	<section id="simulacion" class="section live-lab">
		<div class="section-intro">
			<p class="eyebrow">Laboratorio visual</p>
			<h2>La simulación no es adorno: es el plano vivo del SO.</h2>
			<p>
				En la carpeta <code>frontend</code> vive el escritorio interactivo. Ahora queda unido
				a la web y se sirve en <code>/frontend</code> para que cualquier persona pueda probar
				la experiencia antes de que exista la ISO.
			</p>
		</div>

		<div class="module-grid">
			{#each modules as [title, text]}
				<article>
					<h3>{title}</h3>
					<p>{text}</p>
				</article>
			{/each}
		</div>

		<div class="preview-row">
			<figure>
				<img src="/screenshots/installer.png" alt="Instalador gráfico ArchMacInstall" />
				<figcaption>ArchMacInstall dentro del escritorio simulado.</figcaption>
			</figure>
			<figure>
				<img src="/screenshots/control-center.png" alt="Centro de Control de ArchMac" />
				<figcaption>Control Center con tema, sonido, brillo y acento.</figcaption>
			</figure>
			<figure>
				<img src="/screenshots/spotlight.png" alt="Spotlight de ArchMac" />
				<figcaption>Spotlight como puerta rápida a las apps.</figcaption>
			</figure>
		</div>
	</section>

	<section id="ruta" class="section roadmap-section">
		<div class="section-intro">
			<p class="eyebrow">Ruta de construcción</p>
			<h2>Primero que se sienta bien. Luego que arranque en hardware real.</h2>
			<p>
				La web, la documentación y la simulación son el showcase público. El repositorio del
				SO real debe moverse con otro ciclo: dotfiles, shell nativo, paquetes, ISO y pruebas.
			</p>
		</div>

		<div class="roadmap">
			{#each roadmap as item}
				<article>
					<div class="phase">{item.phase}</div>
					<div>
						<span>{item.state}</span>
						<h3>{item.title}</h3>
						<p>{item.text}</p>
					</div>
				</article>
			{/each}
		</div>

		<div class="stats-strip" aria-label="Datos técnicos del proyecto">
			{#each stats as [label, value]}
				<div>
					<span>{label}</span>
					<strong>{value}</strong>
				</div>
			{/each}
		</div>
	</section>

	<section id="documentacion" class="section docs-section">
		<div class="section-intro">
			<p class="eyebrow">Documentación completa</p>
			<h2>Todo el proyecto explicado en el sitio.</h2>
			<p>
				Los documentos del repositorio se leen aquí mismo: visión, plan, requisitos,
				fidelidad visual, construcción de la distro y contexto técnico para retomar el
				trabajo sin perder el hilo.
			</p>
		</div>

		<div class="docs-layout">
			<aside class="doc-tabs" aria-label="Documentos">
				{#each docs as doc}
					<button
						type="button"
						class:active={activeDoc === doc.id}
						onclick={() => (activeDoc = doc.id)}
					>
						<span>{doc.file}</span>
						<strong>{doc.title}</strong>
						<small>{doc.description}</small>
					</button>
				{/each}
			</aside>

			<article class="doc-reader">
				<div class="reader-top">
					<div>
						<span>{selectedDoc.file}</span>
						<h3>{selectedDoc.title}</h3>
					</div>
					<a href={selectedDocHref} target="_blank" rel="noreferrer">Abrir Markdown</a>
				</div>
				<div class="markdown-body">
					{@html selectedDocHtml}
				</div>
			</article>
		</div>
	</section>
</main>

<footer class="site-footer">
	<div>
		<strong>ArchMac</strong>
		<span>Proyecto independiente inspirado en macOS, basado en Arch Linux.</span>
	</div>
	<a href={SIM_URL}>/frontend</a>
</footer>
