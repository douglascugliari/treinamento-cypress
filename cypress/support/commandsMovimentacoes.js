import locators from '../support/locators';

Cypress.Commands.add('acessarMenuMovimentacoes', () => {
    cy.get(locators.Menu.menu_movimentacoes).click();
});

Cypress.Commands.add('inserirMovimentacoes', () => {
    cy.get(locators.Movimentacoes.tipo_despesa).click();
    cy.get(locators.Movimentacoes.descricao).type('Água');
    cy.get(locators.Movimentacoes.valor).type('150');
    cy.get(locators.Movimentacoes.interessados).type('Douglas');
    cy.get(locators.Movimentacoes.conta).select('Conta para movimentacoes');
    cy.get(locators.Movimentacoes.status).click();
    cy.get(locators.Movimentacoes.button_salvar).click();
});

Cypress.Commands.add('consultarSaldo', (nomeConta, valor) => {
    cy.get(locators.Menu.pagina_inicial).click();
    cy.xpath(locators.Saldo.fn_xp_saldo_conta(nomeConta)).should('contain', valor);
});
