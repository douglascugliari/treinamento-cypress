import locators from '../support/locators';

Cypress.Commands.add('acessarMenuConta', () => {
    cy.get(locators.Menu.settings).click();
    cy.get(locators.Menu.menu_contas).click();
});

Cypress.Commands.add('inserirConta', (nomeConta) => {
    cy.get(locators.Conta.nome_conta).type(nomeConta);
    cy.get(locators.Conta.button_salvar).click();
});

