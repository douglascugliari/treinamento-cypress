/// <reference types="cypress" />

describe('Helpers..', () => {

    before(() => {
        cy.visit('http://www.wcaquino.me/cypress/componentes.html');
    });
    
    it('Wrap', () => {
        const obj = { nome: 'User', idade: 20 };
        expect(obj).to.have.property('nome');
        cy.wrap(obj).should('have.property', 'nome');
        // cy.get('#formNome').then($el => {
        //     // $el.val('Escrevendo via Jquery');
        //     cy.wrap($el).type('Escrevendo via Cypress');
        // });

        const promisse = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(10)
            }, 500);
        })

        cy.get('#buttonSimple').then(() => console.log('Encontrei o primeiro botão'));
        // promisse.then(num => console.log(num));
        cy.wrap(promisse).then(ret => console.log(ret));
        cy.get('#buttonList').then(() => console.log('Encontrei o segundo botão'));

        cy.wrap(1).then(num => {
            return 2;
        }).should('be.equal', 2);
    });

    it('Its', () => {
        const obj = { nome: 'Douglas', idade: 20 };
        cy.wrap(obj).should('have.property', 'nome', 'Douglas');
        cy.wrap(obj).its('nome').should('be.equal', 'Douglas');

        const obj2 = { nome: 'Douglas', idade: 34, endereco:{ rua: 'dos açores'} };
        cy.wrap(obj2).its('endereco').should('have.property','rua');
        cy.wrap(obj2).its('endereco').its('rua').should('contains','dos');
        cy.wrap(obj2).its('endereco.rua').should('contains','dos');
        cy.title().its('length').should('be.equal', 20);
    });

    it.only('Invoke', () => {
        const getValue = () => 1;
        const soma = (a,b) => a + b;

        cy.wrap({ fn: getValue }).invoke('fn').should('be.equal', 1);
        cy.wrap({ fn: soma }).invoke('fn', 2, 5).should('be.equal', 7);

        cy.get('#formNome').invoke('val', 'Texto via Invoke');

        cy.window().invoke('alert', 'Teste Queijo');
        cy.get('#resultado').invoke('html', '<input type="button", value="Eu Sou mal">')
    });
});