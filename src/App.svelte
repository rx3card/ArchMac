<script lang="ts">
	// Enlace a la simulación. En desarrollo corre aparte (frontend, puerto 5173);
	// al desplegar, la simulación compilada se sirve bajo esta ruta.
	const SIM_URL = './frontend/';

	const features = [
		{
			n: '01',
			title: 'Efecto genie',
			text: 'Al minimizar, la ventana se deforma hacia el dock formando un embudo. No es un escalado: se deforma la geometría, como en macOS.',
		},
		{
			n: '02',
			title: 'Dock',
			text: 'Magnificación bajo el cursor, rebote al abrir una app e indicador de las que están en ejecución.',
		},
		{
			n: '03',
			title: 'Spotlight y Launchpad',
			text: 'Buscar y abrir con ⌘+Espacio. Una rejilla a pantalla completa con todas las apps.',
		},
		{
			n: '04',
			title: 'Centro de Control',
			text: 'Brillo, sonido, modo oscuro y color de acento en un solo panel.',
		},
		{
			n: '05',
			title: 'Ventanas',
			text: 'Arrastrar, redimensionar desde cualquier borde, maximizar con transición fluida y cambiar con ⌘+Tab.',
		},
		{
			n: '06',
			title: 'Arranque e instalador',
			text: 'Menú de arranque, modo Recovery e instalador gráfico paso a paso.',
		},
	];

	const shots = [
		{ src: 'spotlight', alt: 'Spotlight', cap: 'Spotlight', note: 'Buscar y abrir apps.' },
		{ src: 'launchpad', alt: 'Launchpad', cap: 'Launchpad', note: 'Todas las apps en una rejilla.' },
		{ src: 'control-center', alt: 'Centro de Control', cap: 'Centro de Control', note: 'Brillo, sonido y tema.' },
		{ src: 'settings', alt: 'Ajustes', cap: 'Ajustes', note: 'Apariencia: claro/oscuro y acento.' },
		{ src: 'installer', alt: 'Instalador', cap: 'ArchMacInstall', note: 'El instalador, como una app más.' },
	];

	const tracks = [
		{
			num: '01',
			title: 'Web y simulación',
			text: 'El prototipo del escritorio en el navegador. Valida el diseño y lo enseña. Es lo que estás viendo.',
			items: ['Escritorio, dock, ventanas y apps', 'Animaciones de ventana', 'Arranque, Recovery e instalador', 'Documentación del proyecto'],
		},
		{
			num: '02',
			title: 'La distribución',
			text: 'El sistema real: Arch + Hyprland + un shell propio en AGS, empaquetado en una ISO instalable.',
			items: ['Compositor Hyprland', 'Shell nativo con el mismo diseño', 'Perfil archiso → ISO', 'Instalador e identidad propia'],
		},
	];

	const docs = [
		{ f: 'README.md', b: 'Visión y estructura', s: 'Qué es y cómo se organiza.' },
		{ f: 'PLAN.md', b: 'Plan maestro', s: 'El roadmap por fases.' },
		{ f: 'REQUISITOS.md', b: 'Requisitos', s: 'Funcionales y no funcionales.' },
		{ f: 'DESIGN-FIDELITY.md', b: 'Fidelidad', s: 'Qué falta para clavar macOS.' },
		{ f: 'SOFTWARE.md', b: 'La distro', s: 'De la web al sistema real.' },
		{ f: 'CONTEXT.md', b: 'Contexto', s: 'Estado y decisiones.' },
	];
</script>

<header class="nav">
	<div class="wrap nav-inner">
		<a class="brand" href="#top"><span class="mark">⌘</span> ArchMac</a>
		<nav class="nav-links">
			<a href="#caracteristicas">Características</a>
			<a href="#capturas">Capturas</a>
			<a href="#proyecto">Proyecto</a>
			<a href="#docs">Documentación</a>
		</nav>
		<a class="btn btn-primary" href={SIM_URL} target="_blank" rel="noopener">Probar</a>
	</div>
</header>

<main id="top">
	<!-- HERO / QUÉ ES -->
	<section class="hero">
		<div class="wrap hero-grid">
			<div>
				<p class="kicker">Distribución basada en Arch Linux</p>
				<h1>La experiencia de macOS, sobre la base de Arch.</h1>
				<div class="rule"></div>
				<p>
					ArchMac es una distribución Linux ligera y rápida con el escritorio de macOS. Lo que ves
					aquí es la simulación web: ábrela y muévete por ella como si fuera tuya.
				</p>
				<div class="actions">
					<a class="btn btn-primary btn-lg" href={SIM_URL} target="_blank" rel="noopener">Probar la simulación</a>
					<a class="btn btn-lg" href="#caracteristicas">Ver características</a>
				</div>
			</div>
			<div class="shot">
				<img src="/screenshots/desktop-light.png" alt="Escritorio de ArchMac" />
			</div>
		</div>
	</section>

	<!-- CARACTERÍSTICAS -->
	<section id="caracteristicas">
		<div class="wrap">
			<div class="head center">
				<div class="rule"></div>
				<h2>Características</h2>
				<p>Cada pieza imita el comportamiento real de macOS, no solo su aspecto.</p>
			</div>
			<div class="features">
				{#each features as f}
					<div class="feature">
						<div class="n">{f.n}</div>
						<h3>{f.title}</h3>
						<p>{f.text}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- CAPTURAS -->
	<section id="capturas" class="alt">
		<div class="wrap">
			<div class="head center">
				<div class="rule"></div>
				<h2>Capturas</h2>
				<p>Todo corriendo en la simulación, en el navegador.</p>
			</div>
			<div class="gallery">
				{#each shots as s}
					<figure>
						<img src="/screenshots/{s.src}.png" alt={s.alt} />
						<figcaption><b>{s.cap}.</b> {s.note}</figcaption>
					</figure>
				{/each}
			</div>
		</div>
	</section>

	<!-- PROYECTO -->
	<section id="proyecto">
		<div class="wrap">
			<div class="head center">
				<div class="rule"></div>
				<h2>Una visión, dos pistas</h2>
				<p>Primero definimos la experiencia en la web; luego la llevamos al sistema real.</p>
			</div>
			<div class="tracks">
				{#each tracks as t}
					<div class="track">
						<span class="num">{t.num}</span>
						<h3>{t.title}</h3>
						<p>{t.text}</p>
						<ul>
							{#each t.items as it}
								<li>{it}</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- DOCS -->
	<section id="docs" class="alt">
		<div class="wrap">
			<div class="head center">
				<div class="rule"></div>
				<h2>Documentación</h2>
				<p>El plan, los requisitos y la guía técnica, escritos y versionados.</p>
			</div>
			<div class="docs">
				{#each docs as d}
					<a class="doc" href={d.f}>
						<span class="f">{d.f}</span>
						<b>{d.b}</b>
						<span>{d.s}</span>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section>
		<div class="wrap cta">
			<h2>Pruébalo. Se siente como un Mac.</h2>
			<p>Abre la simulación y recórrela.</p>
			<a class="btn btn-primary btn-lg" href={SIM_URL} target="_blank" rel="noopener">Probar la simulación</a>
		</div>
	</section>
</main>

<footer class="foot">
	<div class="wrap">
		<div class="foot-inner">
			<div class="brand"><span class="mark">⌘</span> ArchMac</div>
			<div><a href="#caracteristicas">Características</a> · <a href="#docs">Documentación</a> · <a href={SIM_URL}>Simulación</a></div>
		</div>
		<p class="legal">
			Inspirado en macOS, no afiliado a Apple Inc. Los iconos y wallpapers de la simulación son
			provisionales. Proyecto independiente y de código abierto.
		</p>
	</div>
</footer>
