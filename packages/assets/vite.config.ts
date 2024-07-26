import checker from 'vite-plugin-checker';
import dts from 'vite-plugin-dts';
import svgr from 'vite-plugin-svgr';
import {defineConfig, mergeConfig} from 'vite';

import baseConfig from '../../vite.config';

const plugins = [
  // The vite-plugin-checker plugin adds type checking to the Vite build and development process.
  // This helps to catch type errors early in development, without needing to run a separate type-checking process.
  checker({typescript: true}),

  // The vite-plugin-dts plugin generates TypeScript declaration files (.d.ts) during the Vite build process.
  // These declaration files help developers using your library to benefit from type information and autocompletion in their IDEs.
  dts(),

  // Vite plugin to transform SVGs into React components.
  svgr(),
];

const config = defineConfig({
  mode: 'production',

  // The cacheDir setting improves build performance by caching Vite's build artifacts.
  // By storing the cache in the node_modules folder, it is automatically ignored by version control systems.
  cacheDir: '../../node_modules/.vite/assets',

  plugins,

  build: {
    sourcemap: false,
    minify: 'esbuild',

    lib: {
      // The entry setting defines the main file to be imported by consumers of your library.
      // Ensuring a single entry point simplifies the import process and avoids potential issues caused by multiple entry points.
      entry: 'src/index.ts',

      // The fileName setting specifies the name of the output file, which is kept as 'index' for simplicity and ease of use.
      fileName: 'index',

      // The formats setting specifies the module formats generated for the library.
      // In this case, only the 'es' (ES Module) format is generated, which is the modern module system and widely supported by bundlers and browsers.
      formats: ['es'],
    },

    rollupOptions: {
      // The external setting lists packages that should not be bundled into your library.
      // This prevents bundling common dependencies multiple times, reduces your library's bundle size, and improves the end user's experience.
      external: ['react', 'react-dom'],
    },
  },
});

export default mergeConfig(baseConfig, config);
