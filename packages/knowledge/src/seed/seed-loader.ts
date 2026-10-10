import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { KnowledgeStore } from '../store/sqlite-store.js';
import { KnowledgeHeuristicSchema } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function seedKnowledgeStore(store: KnowledgeStore, customSeedPath?: string): number {
  const seedPath = customSeedPath ?? resolve(__dirname, '../../seed/canonical-heuristics.json');
  const rawData = readFileSync(seedPath, 'utf-8');
  const items = JSON.parse(rawData) as unknown[];

  let loaded = 0;
  for (const item of items) {
    const heuristic = KnowledgeHeuristicSchema.parse(item);
    store.insert(heuristic);
    loaded++;
  }

  return loaded;
}
