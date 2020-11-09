/// <reference types="cypress" />

describe('Cypress basic', () => {

    before(() => {
        cy.visit('http://www.wcaquino.me/cypress/componentes.html');
    });

    it.only('Should visit a page and assert title', () => {
        cy.title()
            .should('be.equal', 'Campo de Treinamento')
            .and('contain', 'Campo')
            .and('contain', 'Treinamento');
           
    
        let syncTitle;

        //Tanto Then quanto Should ambos tratam promisse
        cy.title().then(title =>{
            console.log(title);

            cy.get('#formNome').type(title);

            syncTitle = title;
        });

        // cy.title().should(title =>{
        //     console.log(title);
        // });

        cy.get('[data-cy=dataSobrenome]').then($el => {
            $el.val(syncTitle);
        });

        cy.get('#elementosForm\\:sugestoes').then($el => {
            cy.wrap($el).type(syncTitle);
        })
    });

    it('Should find and interact with an element', () => {
        cy.get('#buttonSimple')
            .click()
            .should('have.value', 'Obrigado!');
    });
});