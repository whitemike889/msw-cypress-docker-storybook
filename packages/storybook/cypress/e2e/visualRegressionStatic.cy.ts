import {ROOT_ID, stories} from './constants';
import type {StoryItem} from './constants';
describe('Static stories', () => {
  stories.forEach(
    ({
      urlFragment,
      customViewport = 'iphone-6+',
      orientation = 'portrait',
      ...options
    }: StoryItem) => {
      it(`${urlFragment} image snapshot matches`, () => {
        let viewportName = '';
        if (typeof customViewport === 'string') {
          cy.viewport(customViewport, orientation);
          viewportName = customViewport;
        } else {
          cy.viewport(customViewport.viewportWidth, customViewport.viewportHeight);
          viewportName = `${customViewport.viewportWidth}x${customViewport.viewportHeight}`;
        }
        cy.visit(`/iframe.html?viewMode=story&id=${urlFragment}`);
        cy.get(`[id="${ROOT_ID}"]`).should('be.visible');

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);

        cy.get(`[id="${ROOT_ID}"]`).matchImageSnapshot(`${urlFragment}-${viewportName}-${orientation}`, {
          /**
           * @note by default use `capture: 'viewport', but allow override options per story
           * */
          capture: 'viewport',
          ...options,
        });
      });
    }
  );
});
