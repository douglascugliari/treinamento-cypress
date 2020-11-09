import locators from '../support/locators';

Cypress.Commands.add('acessarMenuExtrato', () => {
    cy.get(locators.Menu.menu_extrato).click();
});

Cypress.Commands.add('removerMovimentacoes', (descricao) => {
    cy.xpath(locators.Extrato.fn_xp_remover_movimentacao(descricao)).click();
});

Cypress.Commands.add('alterarMovimentacoes', (descricao) => {
    cy.xpath(locators.Extrato.fn_xp_alterar_movimentacao(descricao)).click();
})