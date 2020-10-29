describe('drag and drop works', () => {
    beforeEach(()=>{
        cy.visit('/')
        cy.wait(500)
    })
    it('drag from primary to dark', () => {
        const dragloc = '.list-primary'
        const droploc = '.list-dark'
        cy.get('.list-primary > li').each((drag,index1)=>{
            cy.get('.list-dark > li').each((drop,index2)=>{
                if (index1 === 5) return 
                cy.dragAndDrop(dragloc, droploc, index1, index2).wait(500)
                cy.dragAndDrop(droploc, dragloc, index2, index1).wait(500)
            })
        })
        const result = [0,1,2,3,4]
        cy.get('.list-primary > li').each((drag,index)=>{
            if (index === 5) return 
            cy.wrap(drag[index]).contains(`item ${result[index]}`)
        })
        cy.get('.list-dark > li').each((drag,index)=>{
            if (index === 5) return 
            cy.wrap(drag[index]).contains(`Default Button ${result[index]}`)
        })
    })
    it('drag from dark to primary', () => {
        const dragloc = '.list-dark'
        const droploc = '.list-primary'
        cy.get('.list-dark > li').each((drag,index1)=>{
            cy.get('.list-primary > li').each((drop,index2)=>{
                if (index1 === 5) return 
                cy.dragAndDrop(dragloc, droploc, index1, index2).wait(500)
                cy.dragAndDrop(droploc, dragloc, index2, index1).wait(500)
            })
        })
        const result = [0,1,2,3,4]
        cy.get('.list-primary > li').each((drag,index)=>{
            if (index === 5) return 
            cy.wrap(drag[index]).contains(`item ${result[index]}`)
        })
        cy.get('.list-dark > li').each((drag,index)=>{
            if (index === 5) return 
            cy.wrap(drag[index]).contains(`Default Button ${result[index]}`)
        })
    })
    it('drag from primary to primary', () => {
        const dragloc = '.list-primary'
        const droploc = '.list-primary'
        cy.get('.list-primary > li').each((drag,index1)=>{
            cy.get('.list-primary > li').each((drop,index2)=>{
                cy.dragAndDrop(dragloc, droploc, index1, index2).wait(500)
            })
        })
        const result = [0,1,4,2,3]
        cy.get('.list-primary > li').each((drag,index)=>{
            if (index === 5) return 
            cy.wrap(drag[index]).contains(`item ${result[index]}`)
        })
    })

    it('drag from dark to dark', () => {
        const dragloc = '.list-dark'
        const droploc = '.list-dark'
        cy.get('.list-dark > li').each((drag,index1)=>{
            cy.get('.list-dark > li').each((drop,index2)=>{
                cy.dragAndDrop(dragloc, droploc, index1, index2).wait(500)
            })
        })
        const result = [0,1,4,2,3]
        cy.get('.list-dark > li').each((drag,index)=>{
            if (index === 5) return 
            cy.wrap(drag[index]).contains(`Default Button ${result[index]}`)
        })
    })

    
})