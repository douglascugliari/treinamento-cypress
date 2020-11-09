// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import locators from '../support/locators';

Cypress.Commands.add('clickAlert', (locator, message) => {
    cy.get(locator).click();
    cy.on('window:alert', msg => {
        console.log(msg);
        expect(msg).to.be.equal(message);
    })
});

Cypress.Commands.add('login', (email, senha) => {
    cy.visit('http://barrigareact.wcaquino.me/');
    cy.get(locators.Login.user).type(email);
    cy.get(locators.Login.password).type(senha);
    cy.get(locators.Login.button_login).click();
    cy.get('.toast-info .toast-message').should('contain', 'Bem vindo');
    cy.get('.toast-close-button').click();
});

Cypress.Commands.add('resetar', () => {
    cy.get(locators.Menu.settings).click();     
    cy.get(locators.Menu.menu_reset).click();
    // cy.get('.toast-close-button').click();
});


Cypress.Commands.add('getToken', (usuario, senha) => {
    cy.request({
        method: 'POST',
        url: '/signin',
        body: {
            email: usuario,
            redirecionar: false,
            senha: senha
        }
    }).its('body.token').should('not.be.empty')
    .then(token => {
        Cypress.env('token', token)
        return token;
    });
})

Cypress.Commands.add('resetRest', (usuario, senha) => {
    cy.getToken(usuario, senha).then(token => {
        cy.request({
            headers: { Authorization: `JWT ${token}` },
            method: 'GET',
            url: '/reset'
        }).its('status').should('be.equal',200);
    })
})

Cypress.Commands.add('getContaByName', (nome) => {
    cy.getToken('testedouglas@teste.com.br', '123456').then(token => {
        cy.request({
            headers: { Authorization: `JWT ${token}` },
            method: 'GET',
            url: '/contas',
            qs: {
                nome: nome
            }
        }).then(res => {
            return res.body[0].id;
        })
    })
})

Cypress.Commands.overwrite('request', (originalFn, ...options) => {
    if(options.length === 1){
        if(Cypress.env('token')){
            options[0].headers = {
                Authorization: `JWT ${Cypress.env('token')}`
            }
        }
    }
    return originalFn(...options);
});