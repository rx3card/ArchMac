import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline';

const root = process.cwd();
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

const processes = [
	{
		name: 'frontend',
		cwd: path.join(root, 'frontend'),
		args: ['exec', 'vite', '--host', '0.0.0.0', '--port', '5173', '--base', '/frontend/'],
	},
	{
		name: 'web',
		cwd: root,
		args: ['exec', 'vite', '--host', '0.0.0.0', '--port', '3000'],
		env: { ARCHMAC_FRONTEND_PROXY: '1' },
	},
];

const children = processes.map((item) => {
	const command = process.platform === 'win32' ? `${pnpm} ${item.args.join(' ')}` : pnpm;
	const args = process.platform === 'win32' ? [] : item.args;
	const child = spawn(command, args, {
		cwd: item.cwd,
		env: { ...process.env, ...item.env },
		shell: process.platform === 'win32',
		stdio: ['inherit', 'pipe', 'pipe'],
	});

	const pipe = (stream, writer) => {
		const rl = readline.createInterface({ input: stream });
		rl.on('line', (line) => writer.write(`[${item.name}] ${line}\n`));
	};

	pipe(child.stdout, process.stdout);
	pipe(child.stderr, process.stderr);

	child.on('exit', (code, signal) => {
		if (signal) return;
		if (code && code !== 0) {
			console.error(`[${item.name}] exited with code ${code}`);
			stopAll();
			process.exit(code);
		}
	});

	return child;
});

let stopping = false;

function stopAll() {
	if (stopping) return;
	stopping = true;
	for (const child of children) {
		if (!child.killed) child.kill();
	}
}

process.on('SIGINT', () => {
	stopAll();
	process.exit(0);
});

process.on('SIGTERM', () => {
	stopAll();
	process.exit(0);
});
