/// <reference types="cypress" />

describe('Sync', () => {
    
    before(() => {
        // cy.visit('http://www.wcaquino.me/cypress/componentes.html');
        cy.visit('http://mp-master.saj6.softplan.com.br/');
    });

    beforeEach(() =>{
        cy.reload();
    })

    it('Deve aguardar elemento estar disponivel', () => {
        cy.get('#novoCampo').should('not.exist');
        cy.get('#buttonDelay').click();
        cy.get('#novoCampo')
        .type('Teste123');
    });

    it('Deve fazer retrys', () => {
        cy.get('#novoCampo').should('not.exist');
        cy.get('#buttonDelay').click();
        cy.get('#novoCampo').should('not.exist');
        cy.get('#novoCampo')
        .should('exist')
        .type('Teste123');
    });

    it('Usod do find', () => {
        cy.get('#buttonList').click();
        cy.get('#lista li')
            .find('span')
            .should('contain', 'Item 1');
        // cy.get('#lista li')
        //     .find('span')
        //     .should('contain', 'Item 2');      
        cy.get('#lista li span')
            .should('contain', 'Item 2'); 
    });

    it('Uso do Timeout', () => {
        // cy.get('#buttonDelay').click();
        // cy.get('#novoCampo').should('exist');
        
        // cy.get('#buttonList').click();
        // cy.wait(5000);  wait espera até dar o tempo completo
        cy.get('#buttonListDOM').click();
        cy.get('#lista li span', {timeout: 30000})  // Timeout espera até que a condição seja a esperada
        .should('have.length', 2); 
    });

    it('Click Retry', () => { //retry funciona apenas para comandos que não alteram o HTML
        cy.get('#buttonCount')
        .click()
        .click()
        .should('have.value', '111');
    });

    it('Should vs Then', () => {
        cy.get('#buttonListDOM').then($el => {
            // .should('have.length', 1); 
            console.log($el);
            expect($el).to.have.length(1);
        }).and('have.id', 'buttonListDOM');

        cy.get('#buttonListDOM').should($el => {
            // .should('have.length', 1); 
            console.log($el);
            expect($el).to.have.length(1);
        }).and('have.id', 'buttonListDOM');
    });

    it.only('MP', () => {
        cy.get('[data-test=keycloak-login-username]').type('saj6.promotor');
        cy.get('[data-test=keycloak-login-password]').type('54321');
        cy.get('[data-test=keycloak-login-btn-login]')
        .click();
        cy.get('[data-testid="content-cards"]',{timeout:60000}).should('exist');
    });
});