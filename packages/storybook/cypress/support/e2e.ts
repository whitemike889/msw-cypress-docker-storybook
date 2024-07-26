// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import '@testing-library/cypress/add-commands';

import {addMatchImageSnapshotCommand} from '@simonsmith/cypress-image-snapshot/command';

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

addMatchImageSnapshotCommand({
  /**
   * jest-image-snapshot options
   * @see https://github.com/americanexpress/jest-image-snapshot#%EF%B8%8F-api
   */
  failureThreshold: 0.005,
  failureThresholdType: 'percent',
  /**
   * Cypress screenshot options
   * @see https://docs.cypress.io/api/commands/screenshot#Arguments
   * */
  capture: 'viewport',
  /**
   * options for addMatchImageSnapshotCommand from @simonsmith/cypress-image-snapshot
   */
  // screenshotsFolder,
  // isUpdateSnapshots,
  // isSnapshotDebug,
  // specFileRelativeToRoot: Cypress.spec.relative,
  // e2eSpecDir: 'cypress/e2e/',
  // currentTestTitle: '',
  // failureThreshold: 0,
  // failureThresholdType: 'pixel',
  // snapFilenameExtension: '.snap',
  // diffFilenameExtension: '.diff',
});

// 'ResizeObserver loop limit exceeded' errors can be safely ignored:
// https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded#answer-50387233
// 'ResizeObserver loop completed with undelivered notifications' is potentially coming from Canvas Kit, but we're not sure
// https://github.com/Workday/canvas-kit/issues/2316
Cypress.on('uncaught:exception', err => {
  // returning false here prevents Cypress from failing the test
  if (
    err.message.includes('ResizeObserver loop limit exceeded') ||
    err.message.includes('ResizeObserver loop completed with undelivered notifications')
  ) {
    return false;
  }
});
