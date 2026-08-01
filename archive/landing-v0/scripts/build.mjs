import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

const steps = [
	{
		name: 'web',
		cwd: root,
		args: ['exec', 'vite', 'build'],
	},
	{
		name: 'frontend',
		cwd: path.join(root, 'frontend'),
		args: [
			'exec',
			'vite',
			'build',
			'--base=/frontend/',
			'--outDir=../dist/frontend',
			'--emptyOutDir',
		],
	},
];

for (const step of steps) {
	await run(step);
}

function run(step) {
	return new Promise((resolve, reject) => {
		console.log(`\n[${step.name}] ${pnpm} ${step.args.join(' ')}`);
		const command = process.platform === 'win32' ? `${pnpm} ${step.args.join(' ')}` : pnpm;
		const args = process.platform === 'win32' ? [] : step.args;
		const child = spawn(command, args, {
			cwd: step.cwd,
			env: process.env,
			shell: process.platform === 'win32',
			stdio: 'inherit',
		});

		child.on('exit', (code) => {
			if (code === 0) resolve();
			else reject(new Error(`${step.name} failed with code ${code}`));
		});
	});
}
