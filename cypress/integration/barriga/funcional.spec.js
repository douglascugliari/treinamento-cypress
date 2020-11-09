/// <reference types="cypress" />
import locators from '../../support/locators';
import '../../support/commandsConta';
import '../../support/commandsMovimentacoes';
import '../../support/commandsExtrato';

describe('Should test at a funcional level', () => {
    
    before(() => {
        cy.login('testedouglas@teste.com.br', '123456');
      
    });

    beforeEach(() => {
        cy.get(locators.Menu.pagina_inicial).click();
        cy.resetar();
    });

    it('Should update an account', () => {
        cy.acessarMenuConta();
        cy.inserirConta('Conta teste 123');
        cy.get(locators.Messages.message_sucess).should('contain','Conta inserida com sucesso!');
    });

    it('Should Update an Conta', () => {
        cy.acessarMenuConta();
        cy.xpath(locators.Conta.fn_xp_button_alterar('Conta para alterar')).click();
        cy.get(locators.Conta.nome_conta).clear().type('Conta de esgoto');
        cy.get(locators.Conta.button_salvar).click();
        cy.get(locators.Messages.message_sucess).should('contain','Conta atualizada com sucesso!');
    });

    it('Should not Create an account with same name', () => {
        cy.acessarMenuConta();
        cy.inserirConta('Conta mesmo nome');
        cy.get(locators.Messages.message_error).should('contain','Erro: Error: Request failed with status code 400');
    });

    it('Should create a transaction', () => {
        cy.acessarMenuMovimentacoes();
        cy.inserirMovimentacoes();
        cy.get(locators.Messages.message_sucess).should('contain','Movimentação inserida com sucesso!');
        cy.get(locators.Extrato.linhas).should('have.length', 7);
        cy.xpath(locators.Extrato.fn_xp_busca_elemento('Água', 150)).should('exist');
    });

    it('Should get balance', () => {
        cy.consultarSaldo('Conta para saldo', '534');

        cy.acessarMenuExtrato();
        cy.alterarMovimentacoes('Movimentacao 1, calculo saldo');
        // cy.wait(1000);
        cy.get(locators.Movimentacoes.descricao).should('have.value', 'Movimentacao 1, calculo saldo');
        cy.get(locators.Movimentacoes.status).click();
        cy.get(locators.Movimentacoes.button_salvar).click();
        cy.get(locators.Messages.message_sucess).should('contain','sucesso');
        cy.get(locators.Menu.pagina_inicial).click();
        cy.xpath(locators.Saldo.fn_xp_saldo_conta('Conta para saldo')).should('contain', '4.034');
    });

    it('Should remove a transaction', () => {
        cy.acessarMenuExtrato();
        cy.removerMovimentacoes('Movimentacao para exclusao');
        cy.get(locators.Messages.message_sucess).should('contain','sucesso');
    });

});