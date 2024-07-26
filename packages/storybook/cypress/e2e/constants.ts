import type {CypressImageSnapshotOptions} from '@simonsmith/cypress-image-snapshot/types';

export type StoryItem = CypressImageSnapshotOptions & {
  urlFragment: string;
  customViewport?: Cypress.ViewportPreset | Cypress.Viewport;
  orientation?: 'portrait' | 'landscape';
};

export const ROOT_ID = 'storybook-root';

export const stories: StoryItem[] = [
  {
    urlFragment: 'testapp-src-app--app-with-mocked-image',
    capture: 'fullPage',
  },
];
