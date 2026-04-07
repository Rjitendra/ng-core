/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(() => ({
  plugins: [angular(), nxViteTsPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.ts'],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reportsDirectory: '../../coverage/apps/ng-core',
    },
  },
}));
