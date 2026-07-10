<script lang="ts">
	import { go } from '$lib/state/screen.svelte.ts';
	import { apps } from '$lib/state/apps.svelte.ts';
	import AppleIcon from '~icons/mdi/apple';

	function closeApp() {
		apps.open['install'] = false;
	}

	type Step = 'welcome' | 'region' | 'disk' | 'account' | 'summary' | 'installing' | 'done';

	const order: Step[] = ['welcome', 'region', 'disk', 'account', 'summary', 'installing', 'done'];
	const stepTitles: Record<Step, string> = {
		welcome: 'Bienvenido',
		region: 'Idioma y región',
		disk: 'Disco',
		account: 'Cuenta',
		summary: 'Resumen',
		installing: 'Instalando',
		done: 'Listo',
	};

	let step = $state<Step>('welcome');

	// Datos del asistente
	let language = $state('Español');
	let region = $state('Colombia');
	let keyboard = $state('Latinoamérica');
	const disks = [
		{ id: 'nvme0', name: 'Disco principal · NVMe', size: '512 GB' },
		{ id: 'sata1', name: 'Disco secundario · SATA', size: '1 TB' },
	];
	let disk = $state(disks[0].id);
	let wipe = $state(true);
	let fullName = $state('');
	let username = $state('');
	let password = $state('');
	let hostname = $state('archmac');

	let progress = $state(0);
	let logLine = $state('');

	const idx = $derived(order.indexOf(step));

	const canNext = $derived.by(() => {
		if (step === 'account') return username.trim() !== '' && password.length >= 4;
		return true;
	});

	function next() {
		if (step === 'summary') return startInstall();
		const i = order.indexOf(step);
		if (i < order.length - 1) step = order[i + 1];
	}
	function back() {
		const i = order.indexOf(step);
		if (i > 0 && step !== 'installing' && step !== 'done') step = order[i - 1];
	}

	const installSteps = [
		'Particionando el disco…',
		'Formateando (btrfs)…',
		'Copiando el sistema base…',
		'Instalando el entorno ArchMac (Hyprland)…',
		'Configurando el gestor de arranque…',
		'Creando el usuario…',
		'Aplicando la identidad visual…',
		'Finalizando…',
	];

	async function startInstall() {
		step = 'installing';
		progress = 0;
		for (let i = 0; i < installSteps.length; i++) {
			logLine = installSteps[i];
			await new Promise((r) => setTimeout(r, 650));
			progress = Math.round(((i + 1) / installSteps.length) * 100);
		}
		await new Promise((r) => setTimeout(r, 400));
		step = 'done';
	}
</script>

<div class="installer">
	<header class="titlebar app-window-drag-handle">
		<span class="t-brand"><AppleIcon /> ArchMac Install</span>
	</header>

	<div class="body">
		<aside>
			<div class="brand">Instalador</div>
			<ul class="steps">
			{#each order.slice(0, 6) as s, i}
				<li class:active={s === step} class:done={order.indexOf(step) > i}>
					<span class="dot">{order.indexOf(step) > i ? '✓' : i + 1}</span>
					{stepTitles[s]}
				</li>
			{/each}
		</ul>
		<div class="version">ArchMac 0.1 · prototipo</div>
	</aside>

	<main>
		<div class="content">
			{#if step === 'welcome'}
				<div class="hero">
					<div class="logo"><AppleIcon /></div>
					<h1>Bienvenido a ArchMac</h1>
					<p>
						El instalador te guiará para configurar ArchMac en tu equipo: una distribución Linux
						con la elegancia de macOS y la potencia de Arch.
					</p>
				</div>
			{:else if step === 'region'}
				<h2>Idioma y región</h2>
				<label>Idioma
					<select bind:value={language}>
						<option>Español</option>
						<option>English</option>
						<option>Português</option>
					</select>
				</label>
				<label>Región
					<select bind:value={region}>
						<option>Colombia</option>
						<option>México</option>
						<option>España</option>
						<option>Argentina</option>
					</select>
				</label>
				<label>Distribución del teclado
					<select bind:value={keyboard}>
						<option>Latinoamérica</option>
						<option>Español (España)</option>
						<option>US</option>
					</select>
				</label>
			{:else if step === 'disk'}
				<h2>Selecciona el disco</h2>
				<p class="muted">Elige dónde instalar ArchMac. Esto borrará el disco seleccionado.</p>
				<div class="disks">
					{#each disks as d}
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<div class="disk-card" class:sel={disk === d.id} onclick={() => (disk = d.id)}>
							<span class="d-name">{d.name}</span>
							<span class="d-size">{d.size}</span>
						</div>
					{/each}
				</div>
				<label class="check">
					<input type="checkbox" bind:checked={wipe} /> Borrar el disco e instalar limpio (recomendado)
				</label>
			{:else if step === 'account'}
				<h2>Crea tu cuenta</h2>
				<label>Nombre completo
					<input bind:value={fullName} placeholder="Name" />
				</label>
				<label>Nombre de usuario
					<input bind:value={username} placeholder="Username" autocomplete="off" />
				</label>
				<label>Contraseña <span class="muted">(mín. 4 caracteres)</span>
					<input type="password" bind:value={password} autocomplete="off" />
				</label>
				<label>Nombre del equipo
					<input bind:value={hostname} />
				</label>
			{:else if step === 'summary'}
				<h2>Resumen</h2>
				<p class="muted">Revisa la configuración antes de instalar.</p>
				<table class="summary">
					<tbody>
						<tr><td>Idioma</td><td>{language} · {region}</td></tr>
						<tr><td>Teclado</td><td>{keyboard}</td></tr>
						<tr><td>Disco</td><td>{disks.find((d) => d.id === disk)?.name} {wipe ? '(borrado)' : ''}</td></tr>
						<tr><td>Usuario</td><td>{username || '—'}</td></tr>
						<tr><td>Equipo</td><td>{hostname}</td></tr>
					</tbody>
				</table>
				<p class="warn">⚠ Se borrará el disco seleccionado. Esta acción no se puede deshacer.</p>
			{:else if step === 'installing'}
				<div class="installing">
					<div class="logo big"><AppleIcon /></div>
					<h2>Instalando ArchMac…</h2>
					<div class="bar"><div class="fill" style:width="{progress}%"></div></div>
					<div class="pct">{progress}%</div>
					<div class="log">{logLine}</div>
				</div>
			{:else if step === 'done'}
				<div class="hero">
					<div class="logo check-logo">✓</div>
					<h1>¡ArchMac está instalado!</h1>
					<p>La instalación se completó correctamente. Reinicia para empezar a usar ArchMac.</p>
				</div>
			{/if}
		</div>

		<footer class="actions">
			{#if step === 'done'}
				<button class="primary" onclick={() => go('uefi')}>Reiniciar ahora</button>
			{:else if step === 'installing'}
				<span class="muted">No apagues el equipo…</span>
			{:else}
				<button class="ghost" onclick={closeApp}>Cancelar</button>
				<span class="spacer"></span>
				{#if idx > 0}<button class="ghost" onclick={back}>Atrás</button>{/if}
				<button class="primary" disabled={!canNext} onclick={next}>
					{step === 'summary' ? 'Instalar' : 'Continuar'}
				</button>
			{/if}
		</footer>
		</main>
	</div>
</div>

<style>
	.installer {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;

		border-radius: inherit;
		overflow: hidden;

		background: var(--system-color-light, #f2f2f7);
		color: #1c1c1e;
		font-family: var(--system-font-family, system-ui);
		user-select: none;
	}

	.titlebar {
		display: flex;
		align-items: center;
		justify-content: center;

		height: 2.4rem;
		flex: none;

		border-bottom: 1px solid hsla(0, 0%, 0%, 0.08);
		background: hsla(0, 0%, 100%, 0.55);
	}
	.t-brand {
		display: flex;
		align-items: center;
		gap: 0.4rem;

		font-size: 0.85rem;
		font-weight: 600;
		color: hsla(0, 0%, 0%, 0.7);
	}
	.t-brand :global(svg) {
		font-size: 1rem;
	}

	.body {
		flex: 1;
		min-height: 0;

		display: grid;
		grid-template-columns: 210px 1fr;
	}

	aside {
		display: flex;
		flex-direction: column;
		padding: 1.5rem 1rem;
		background: linear-gradient(160deg, #e9edf5, #d6deec);
		border-right: 1px solid hsla(0, 0%, 0%, 0.08);
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 700;
		font-size: 1.05rem;
		margin-bottom: 2rem;
	}
	.brand :global(svg) {
		font-size: 1.2rem;
	}
	.steps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		flex: 1;
	}
	.steps li {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.5rem 0.6rem;
		border-radius: 0.5rem;
		font-size: 0.9rem;
		color: hsla(0, 0%, 0%, 0.55);
	}
	.steps li.active {
		background: hsla(0, 0%, 100%, 0.7);
		color: #1c1c1e;
		font-weight: 600;
	}
	.dot {
		display: grid;
		place-items: center;
		width: 1.4rem;
		height: 1.4rem;
		border-radius: 50%;
		background: hsla(0, 0%, 0%, 0.12);
		font-size: 0.75rem;
		font-weight: 600;
	}
	.steps li.active .dot {
		background: var(--system-color-primary, #0a84ff);
		color: #fff;
	}
	.steps li.done .dot {
		background: #34c759;
		color: #fff;
	}
	.version {
		font-size: 0.75rem;
		color: hsla(0, 0%, 0%, 0.4);
	}

	main {
		display: flex;
		flex-direction: column;
	}
	.content {
		flex: 1;
		padding: 2.5rem;
		overflow-y: auto;
	}

	.hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.8rem;
		margin-top: 2rem;
	}
	.logo {
		display: grid;
		place-items: center;
		font-size: 3.5rem;
	}
	.logo :global(svg) {
		font-size: 3.5rem;
	}
	.logo.big :global(svg) {
		font-size: 3rem;
	}
	.check-logo {
		width: 5rem;
		height: 5rem;
		border-radius: 50%;
		background: #34c759;
		color: #fff;
		font-size: 2.5rem;
	}
	.hero h1 {
		font-size: 1.8rem;
		font-weight: 700;
	}
	.hero p {
		max-width: 28rem;
		color: hsla(0, 0%, 0%, 0.6);
		line-height: 1.5;
	}

	h2 {
		font-size: 1.4rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}
	.muted {
		color: hsla(0, 0%, 0%, 0.5);
		font-size: 0.9rem;
	}
	.warn {
		margin-top: 1rem;
		color: #c9402a;
		font-weight: 500;
	}

	label {
		display: block;
		margin-bottom: 1rem;
		font-size: 0.9rem;
		font-weight: 500;
	}
	input,
	select {
		display: block;
		width: 100%;
		max-width: 24rem;
		margin-top: 0.35rem;
		padding: 0.5rem 0.7rem;
		border: 1px solid hsla(0, 0%, 0%, 0.15);
		border-radius: 0.5rem;
		background: #fff;
		font-family: inherit;
		font-size: 0.95rem;
		font-weight: 400;
	}
	input:focus,
	select:focus {
		outline: 2px solid var(--system-color-primary, #0a84ff);
		outline-offset: -1px;
	}
	.check {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 400;
	}
	.check input {
		width: auto;
		margin: 0;
	}

	.disks {
		display: flex;
		gap: 1rem;
		margin: 1rem 0;
	}
	.disk-card {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		padding: 1rem 1.2rem;
		border: 2px solid hsla(0, 0%, 0%, 0.12);
		border-radius: 0.7rem;
		cursor: pointer;
		min-width: 12rem;
		background: #fff;
	}
	.disk-card.sel {
		border-color: var(--system-color-primary, #0a84ff);
		box-shadow: 0 0 0 3px hsla(211, 100%, 60%, 0.2);
	}
	.d-name {
		font-weight: 600;
	}
	.d-size {
		color: hsla(0, 0%, 0%, 0.5);
		font-size: 0.85rem;
	}

	.summary {
		border-collapse: collapse;
		width: 100%;
		max-width: 30rem;
		margin-top: 0.5rem;
	}
	.summary td {
		padding: 0.5rem 0.4rem;
		border-bottom: 1px solid hsla(0, 0%, 0%, 0.08);
		font-size: 0.95rem;
	}
	.summary td:first-child {
		color: hsla(0, 0%, 0%, 0.5);
		width: 9rem;
	}

	.installing {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 1rem;
		margin-top: 2rem;
	}
	.bar {
		width: 26rem;
		max-width: 80%;
		height: 8px;
		border-radius: 50px;
		background: hsla(0, 0%, 0%, 0.1);
		overflow: hidden;
	}
	.fill {
		height: 100%;
		background: var(--system-color-primary, #0a84ff);
		border-radius: inherit;
		transition: width 0.4s ease;
	}
	.pct {
		font-weight: 700;
		font-size: 1.2rem;
	}
	.log {
		color: hsla(0, 0%, 0%, 0.55);
		font-size: 0.9rem;
		font-family: var(--system-font-mono, ui-monospace, monospace);
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		padding: 1rem 2.5rem;
		border-top: 1px solid hsla(0, 0%, 0%, 0.08);
		background: hsla(0, 0%, 100%, 0.6);
	}
	.spacer {
		flex: 1;
	}
	.primary {
		background: var(--system-color-primary, #0a84ff);
		color: #fff;
		font-weight: 600;
		padding: 0.55rem 1.5rem;
		border-radius: 0.5rem;
	}
	.primary:disabled {
		opacity: 0.45;
	}
	.primary:not(:disabled):hover {
		filter: brightness(1.08);
	}
	.ghost {
		padding: 0.55rem 1.2rem;
		border-radius: 0.5rem;
		color: #1c1c1e;
		font-weight: 500;
	}
	.ghost:hover {
		background: hsla(0, 0%, 0%, 0.06);
	}
</style>
