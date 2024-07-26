import {addMatchImageSnapshotPlugin} from '@simonsmith/cypress-image-snapshot/plugin';
import {defineConfig} from 'cypress';

export default defineConfig({
  e2e: {
    env: {
      failOnSnapshotDiff: true,
      updateSnapshots: false,
      // debugSnapshots: true, // Set to true to see the diff logs
    },
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    setupNodeEvents(on) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'electron' && browser.isHeadless) {
          // The maximum fullPage screenshot size can be 1600x1200.
          // We set this so that when we use "bigger" devices, we can capture the full screenshot as needed.
          // Otherwise, the default window would be 1280x720, which is too small for us.
          launchOptions.preferences.width = 1600;
          launchOptions.preferences.height = 1200;
        }
        return launchOptions;
      });
      addMatchImageSnapshotPlugin(on);
    },
    baseUrl: process.env.CYPRESS_baseUrl || 'http://localhost:6006',
    specPattern: 'cypress/e2e/**/*.cy.ts',
  },
});
