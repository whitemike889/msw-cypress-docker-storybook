import {initialize, mswLoader} from 'msw-storybook-addon';
import {INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS} from '@storybook/addon-viewport';

// Initialize MSW
initialize({
  serviceWorker: {
    // Points to the custom location of the Service Worker file.
    url: import.meta.env.DEV ? './mockServiceWorker.js' : `${import.meta.env.STORYBOOK_ORIGIN}/mockServiceWorker.js`,
  },
});

// We want to add the macbook16 viewport to the default viewports as we use this in visual regression testing
// https://docs.cypress.io/api/commands/viewport#Arguments
const customViewports = {
  macbook16: {
    name: 'Macbook 16',
    styles: {
      width: '1536px',
      height: '960px',
    },
  },
};

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    // Give us a choice of viewports to test with in the viewports addon
    viewports: {
      ...INITIAL_VIEWPORTS,
      ...MINIMAL_VIEWPORTS,
      ...customViewports,
    },
  },
  layout: 'fullscreen', // this would normally be padded by default but seems unnecessary and can interfere with our visual testing
};

// Provide the MSW addon loader globally
export const loaders = [mswLoader];
