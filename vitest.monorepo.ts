import {defineConfig} from 'vitest/config';

// This is used to set the attributes that should apply when `test` or `testc` runs in the monorepo, including the root "test-repo" vite project set by the root vite.config.ts
export default defineConfig({
  test: {
    testTimeout: 60000,
    // Sets the test reporter format to 'verbose', which gives detailed information about each test run.
    // Other options include 'default' and 'tap', depending on your preferences and requirements.
    reporters: ['verbose'],

    // We don't want vitest to fail if it encounters a package that has no tests
    passWithNoTests: true,
  },
});
