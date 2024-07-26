import fs from 'node:fs/promises';

/**
 * Custom Vite plugin to fix a bug in react-virtualized with a bogus import
 * @see https://github.com/bvaughn/react-virtualized/issues/1632#issuecomment-1483966063
 */

const WRONG_CODE = 'import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";';

export default function () {
  return {
    name: 'react-virtualized-plugin',
    setup: ({onLoad}) => {
      onLoad(
        {
          filter: /react-virtualized[/\\]dist[/\\]es[/\\]WindowScroller[/\\]utils[/\\]onScroll\.js$/,
        },
        async ({path}) => {
          // We can safely disable this warning because we are already filtering the path strictly with the regex above
          // eslint-disable-next-line security/detect-non-literal-fs-filename
          const code = await fs.readFile(path, 'utf8');
          return {contents: code.replace(WRONG_CODE, '')};
        }
      );
    },
  };
}
