import path from 'path';

import react from '@vitejs/plugin-react';
import {defineConfig} from 'vitest/config';

import {getSharedPackageAliases} from './vite.config';
import baseConfig from './vitest.monorepo';

const plugins = [
  react({
    jsxImportSource: 'react',
    babel: {
      plugins: ['@emotion/babel-plugin'],
    },
  }),
];

// This is used to set the attributes that should apply when `test` or `testc` runs in the monorepo for projects within `apps` or `packages` (so, excluding the root "test-repo" vite project set by the root vite.config.ts)
export default defineConfig({
  plugins,
  test: {
    ...baseConfig.test,
    // Sets the print limit for errors in the console to a high value so that we can see all errors from React Testing Library.
    globalSetup: path.resolve(__dirname, 'setDebugPrintLimit.ts'),

    // alias required to get coverage working across monorepo projects: https://github.com/vitest-dev/vitest/issues/5218#issuecomment-1952174964
    // maps each shared package name to their source code entry file
    alias: getSharedPackageAliases(),
  },
});
