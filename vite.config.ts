import path from 'path';
import fs from 'fs';
import fg from 'fast-glob';

import {defineConfig} from 'vitest/config';

import {workspaces} from './package.json';
import baseConfig from './vitest.monorepo';

/**
 * Returns a map of package names to their main entry point.
 * Compatible with vitest and eslint "alias" property
 *
 * Assumes each package has a main entry file at "src/index"
 * The result is an object that looks like the following:
 * @example
 * {
 *   '@aislinn/assets': '/absolute/path/to/test-repo/packages/assets/src/index',
 *    // other packages ...
 * }
 */
export const getSharedPackageAliases = () => {
  return workspaces
    .flatMap(pattern => fg.sync(pattern, {onlyDirectories: true, cwd: __dirname}))
    .reduce(
      (acc, projectDir) => {
        const projectPath = path.resolve(__dirname, projectDir);
        const packageJsonPath = path.join(projectPath, 'package.json');

        if (fs.existsSync(packageJsonPath)) {
          const packageJson: {name: string} = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

          // Only include shared packages under the `@aislinn` workspace. Excludes apps
          if (packageJson.name.startsWith('@aislinn')) {
            acc[packageJson.name] = path.join(projectPath, 'src/index');
          }
        }
        return acc;
      },
      {} as Record<string, string>
    );
};

// This file is only used for the root `test` and `testc` commands in the monorepo, so that we can generate coverage reports for the entire monorepo.
export default defineConfig({
  test: {
    ...baseConfig.test,
    // The coverage setting enables test coverage reporting, helping you understand how much of your code is covered by tests.
    // This information can be used to identify areas of the code that require additional testing.
    coverage: {
      // These reporters are required for displaying code coverage information:
      // text to show the results in the console
      // lcov to produce reports for use in SonarQube
      // html to allow devs to view interactive reports in their browsers with custom test:report command
      reporter: ['text', 'lcov', 'html'],

      // Generates the coverage reports even if the test run fails - allows us to use test:report to view reports with up to date results.
      reportOnFailure: true,

      exclude: [
        '**/*.stories*',
        '**storybook**',
        'packages/storybook*',
        '**vitest**',
        'setDebugPrintLimit.ts',
        'vite-env.d.ts',
      ],
    },
  },
});
