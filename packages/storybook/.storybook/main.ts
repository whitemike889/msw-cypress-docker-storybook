import {dirname, join} from 'path';
import {InlineConfig, mergeConfig} from 'vite';
import svgr from 'vite-plugin-svgr';
import type {StorybookConfig} from '@storybook/react-vite';
import reactVirtualized from '../../../config/vite/plugins/reactVirtualized';

const config: StorybookConfig = {
  stories: [
    '../../../apps/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    '../../../packages/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
  ],

  addons: [getAbsolutePath('@storybook/addon-essentials'), getAbsolutePath('@storybook/addon-a11y')],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  staticDirs: ['./static'],

  async viteFinal(config, {configType}) {
    return mergeConfig(config, {
      plugins: [svgr()],
      optimizeDeps: {
        include: ['@emotion/react', 'msw-storybook-addon'],
        esbuildOptions: {
          plugins: [reactVirtualized()], // https://github.com/bvaughn/react-virtualized/issues/1722#issuecomment-1911672178
        },
      },
      define: {
        // Allows asset files to be loaded from base storybook path in local dev
        // or from the configured STORYBOOK_ORIGIN path when running the deployed version
        ASSETS_DIRECTORY: JSON.stringify(configType === 'DEVELOPMENT' ? config.base : process.env.STORYBOOK_ORIGIN),
      },
    } satisfies InlineConfig);
  },

  docs: {
    autodocs: false,
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;

// This is added by Storybook upgrade commands when it detects storybook running in a monorepo
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
