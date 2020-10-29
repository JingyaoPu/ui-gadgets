describe('Click aciton works', () => {
  before(() => {
    cy.visit('/')
  })
  it('clicks button in list', () => {
    cy.contains('Default Button 0').click()
  })
})