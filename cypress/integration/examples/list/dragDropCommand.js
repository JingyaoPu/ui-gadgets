const calCenter=(rect)=>{
    return ({x:(rect.left+rect.right)/2, y:(rect.top+rect.bottom)/2})
}

Cypress.Commands.add('dragAndDrop', (subject, target, dragIndex, dropIndex) => {
    cy.get(subject).should('be.visible', { timeout: 2000})
    const BUTTON_INDEX = 0;
    cy.get(target).find('li')
        .then($target => {
            let coordsDrop = calCenter($target[dropIndex].getBoundingClientRect());
            Cypress.log({
                message: `Dragging element from ${subject},${dragIndex} to ${target},${dropIndex}`,
            });
            cy.get(subject).find('li')
                .then(subject => {
                    const coordsDrag = calCenter(subject[dragIndex].getBoundingClientRect());
                    console.log(subject[dragIndex])
                    cy.wrap(subject[dragIndex])
                        .trigger('mousedown', {
                            button: BUTTON_INDEX,
                            // pageX: coordsDrag.x,
                            // pageY: coordsDrag.y,
                            force: true
                        })
                        .trigger('mousemove', {
                            button: BUTTON_INDEX,
                            pageX: coordsDrag.x + 10,
                            pageY: coordsDrag.y,
                            force: true
                        })
                    cy.get('body')
                        .trigger('mousemove', {
                            button: BUTTON_INDEX,
                            pageX: coordsDrop.x,
                            pageY: coordsDrop.y,
                            force: true
                        })
                    cy.get(target)
                        .trigger('mousemove', {
                            button: BUTTON_INDEX,
                            pageX: coordsDrop.x,
                            pageY: coordsDrop.y,
                            force: true
                        })
                        .trigger('mouseup')
                        
                });
        });
});