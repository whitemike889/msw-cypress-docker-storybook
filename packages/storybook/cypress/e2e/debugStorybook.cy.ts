import {ROOT_ID} from './constants';
describe('Testing', () => {
  it('Visit the Storybook entry', () => {
    cy.visit(
      '/iframe.html?viewMode=story&id=testapp-src-app--app-with-mocked-image'
    );
    cy.get(`[id="${ROOT_ID}"]`).should('be.visible');

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(60000);
  });
});
