describe('template spec', () => {
  it('passes', () => {
       cy.visit('https://example.cypress.io')
       cy.wait('@loginSuccess', { timeout: 15000 });
  })
})