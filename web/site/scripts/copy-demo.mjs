// Copia el build de la simulación (web/simulation/dist) dentro del sitio (dist/demo)
// para que el botón «Ver demo» funcione en el mismo despliegue estático.
import { cpSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const from = fileURLToPath(new URL('../../simulation/dist', import.meta.url));
const to = fileURLToPath(new URL('../dist/demo', import.meta.url));

if (!existsSync(from)) {
	console.error('No existe web/simulation/dist — ejecuta antes: pnpm --dir ../simulation build');
	process.exit(1);
}
cpSync(from, to, { recursive: true });
console.log(`Demo copiada a ${to}`);
