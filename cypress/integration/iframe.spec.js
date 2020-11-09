/// <reference types="cypress" />

describe('Work with Iframes', () => {

    it('Deve preencher campo de texto', () => {
        cy.visit('http://www.wcaquino.me/cypress/componentes.html');
        cy.get('#frame1').then(iframe => {
           const body = iframe.contents().find('body'); 
           cy.wrap(body).find('#tfield').type('Douglas').should('have.value', 'Douglas');
        })
    });

    it('Deve testar frame diretamente', () => {
        cy.visit('http://www.wcaquino.me/cypress/frame.html');
        cy.get('#otherButton').click();
        cy.get('#tfield').type('Douglas').should('have.value', 'Douglas');
        cy.on('window:alert', msg=> {
            expect(msg).to.be.equal('Click OK!');
        })
    });
    
})