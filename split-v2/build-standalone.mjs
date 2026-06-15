import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const panelWorkerPath = path.join(root, 'split', 'frontend-worker.js');
const sourcePath = path.join(here, 'frontend-worker-subscriber.src.js');
const outputPath = path.join(here, 'frontend-worker-subscriber.js');

let panelWorker = fs.readFileSync(panelWorkerPath, 'utf8');
panelWorker = panelWorker.replace(/export\s+default\s*\{/, 'const originalPanelWorker = {');

let subscriberWorker = fs.readFileSync(sourcePath, 'utf8');
subscriberWorker = subscriberWorker.replace(/^import\s+originalPanelWorker\s+from\s+["']\.\.\/split\/frontend-worker\.js["'];\s*\r?\n\r?\n?/, '');

fs.writeFileSync(outputPath, `${panelWorker}\n\n${subscriberWorker}`, 'utf8');
console.log(`Generated ${path.relative(root, outputPath)} as a standalone Worker`);
