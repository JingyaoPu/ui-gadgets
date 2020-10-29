describe('load page', () => {
    before(() => {
        cy.visit('/')
    })
    it('load elements', () => {
      
      cy.get('.list-primary > li').should('have.length', 6)
      .each(($li, index, $lis) => {
        if(index === 5) return
        cy.wrap($li)
        .should('have.class','cursor-ondrag pat-list-draggable')
        .contains(`item ${index}`)
      })
      cy.get('.list-dark > li').should('have.length', 6)
      .each(($li, index, $lis) => {
        if(index === 5) return
        cy.wrap($li)
        .should('have.class','cursor-ondrag pat-list-draggable')
        .contains('button',`Default Button ${index}`)
      })
    })
  })