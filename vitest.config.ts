import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    {
      name: 'node-sqlite-fix',
      enforce: 'pre',
      resolveId(id) {
        if (id === 'node:sqlite' || id === 'sqlite') {
          return '\0node:sqlite';
        }
        return null;
      },
      load(id) {
        if (id === '\0node:sqlite') {
          return `
            import { createRequire } from 'node:module';
            const require = createRequire(import.meta.url);
            const sqlite = require('node:sqlite');
            export const { DatabaseSync, StatementSync } = sqlite;
            export default sqlite;
          `;
        }
        return null;
      }
    }
  ],
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/*/tests/**/*.test.ts'],
    passWithNoTests: true
  }
});
