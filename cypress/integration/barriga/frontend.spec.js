/// <reference types="cypress" />
import locators from '../../support/locators';
import '../../support/commandsConta';
import '../../support/commandsMovimentacoesFrontend';
import '../../support/commandsExtrato';
import buildEnv from '../../support/buildEnv';

describe('Should test at a funcional level', () => {

    after(() => {
        cy.clearLocalStorage();
    });
    
    beforeEach(() => {
        buildEnv();
        cy.login('testedouglas@teste.com.br', 'senha errada');
        cy.get(locators.Menu.pagina_inicial).click();
    });

    it('Should test the responsiveness', () => {
        cy.get(locators.Menu.pagina_inicial).should('exist').and('be.visible');
        cy.viewport(500,700);
        cy.get(locators.Menu.pagina_inicial).should('exist').and('be.not.visible');
        cy.viewport('iphone-5');
        cy.get(locators.Menu.pagina_inicial).should('exist').and('be.not.visible');
        cy.viewport('ipad-2');
        cy.get(locators.Menu.pagina_inicial).should('exist').and('be.visible');
    });

    it('Should Create Conta', () => {
        cy.route({
            method: 'POST',
            url: '/contas',
            response: { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 }
        }).as('saveContas');

        cy.acessarMenuConta();

        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                {id:1,nome:'Carteira',visivel:true,usuario_id:1},
                {id:2,nome:'Banco',visivel:true,usuario_id:1},
                {id: 3,nome:'Conta de teste',visivel:true,usuario_id:1}
            ]
            
        }).as('contasSave');

        cy.inserirConta('Conta teste 123');
        cy.get(locators.Messages.message_sucess).should('contain','Conta inserida com sucesso!');
    });

    it('Should update an account', () => {
        cy.route({
            method: 'PUT',
            url: '/contas/**',
            response: [
                {id:1,nome:'Conta de esgoto',visivel:true,usuario_id:1}
            ]
            
        }).as('updateContas');

        cy.acessarMenuConta();

        cy.xpath(locators.Conta.fn_xp_button_alterar('Carteira')).click();
        cy.get(locators.Conta.nome_conta).clear().type('Conta de esgoto');
        cy.get(locators.Conta.button_salvar).click();
        cy.get(locators.Messages.message_sucess).should('contain','Conta atualizada com sucesso!');
   
    });

    it('Should not Create an account with same name', () => {
        cy.route({
            method: 'POST',
            url: '/contas',
            response: [
                {"error":"Já existe uma conta com esse nome!"}
            ], 
            status: 400
            
        }).as('saveContaMesmoNome');

        cy.acessarMenuConta();
        cy.inserirConta('Banco');
        cy.get(locators.Messages.message_error).should('contain','Erro: Error: Request failed with status code 400');
    });

    it('Should create a transaction', () => {
        cy.route({
            method: 'POST',
            url: '/transacoes',
            response: [
                {"id":1,"descricao":"Teste Transaction","envolvido":"Teste","observacao":null,"tipo":"REC","data_transacao":"2020-11-02T03:00:00.000Z","data_pagamento":"2020-11-02T03:00:00.000Z","valor":"150.00","status":true,"conta_id":312536,"usuario_id":12072,"transferencia_id":null,"parcelamento_id":null}
            ]
        }).as('saveTransaction');

        cy.route({
            method: 'GET',
            url: '/extrato/**',
            response: 'fixture:movimentacaoSalva'
            
        }).as('extrato');

        cy.acessarMenuMovimentacoes();
        cy.inserirMovimentacoes();
        cy.get(locators.Messages.message_sucess).should('contain','Movimentação inserida com sucesso!');
        cy.get(locators.Extrato.linhas).should('have.length', 3);
        cy.xpath(locators.Extrato.fn_xp_busca_elemento('Água', 150)).should('exist');
    });

    it('Should get balance', () => {
        cy.route({
            method: 'GET',
            url: '/transacoes/**',
            response:  {
                "conta":"Conta mesmo nome",
                "id":286145,
                "descricao":"Água",
                "envolvido":"Marcio",
                "observacao":null,
                "tipo":"REC",
                "data_transacao":"2020-11-02T03:00:00.000Z",
                "data_pagamento":"2020-11-02T03:00:00.000Z",
                "valor":"150.00",
                "status":true,
                "conta_id":312536,
                "usuario_id":12072,
                "transferencia_id":null,
                "parcelamento_id":null
             }
        })

        cy.route({
            method: 'PUT',
            url: '/transacoes/**',
            response:  {
                "conta":"Conta mesmo nome",
                "id":286145,
                "descricao":"Água",
                "envolvido":"Marcio",
                "observacao":null,
                "tipo":"REC",
                "data_transacao":"2020-11-02T03:00:00.000Z",
                "data_pagamento":"2020-11-02T03:00:00.000Z",
                "valor":"150.00",
                "status":true,
                "conta_id":312536,
                "usuario_id":12072,
                "transferencia_id":null,
                "parcelamento_id":null
             }
        })


        cy.consultarSaldo('Carteira', '15.586');

        cy.acessarMenuExtrato();
        cy.alterarMovimentacoes('Água');
        // cy.wait(1000);
        cy.get(locators.Movimentacoes.descricao).should('have.value', 'Água');
        cy.get(locators.Movimentacoes.status).click();
        cy.get(locators.Movimentacoes.button_salvar).click();
        cy.get(locators.Messages.message_sucess).should('contain','sucesso');

        cy.route({
            method: 'GET',
            url: '/saldo',
            response: [{
               conta_id: 1000,
               conta: 'Carteira',
               saldo: '15586.00'
            },
            {
                conta_id: 1001,
                conta: 'Banco',
                saldo: '95647.00'
            }
        ]
        }).as('saldo');

        cy.get(locators.Menu.pagina_inicial).click();
        cy.xpath(locators.Saldo.fn_xp_saldo_conta('Carteira')).should('contain', '15.586');
    });

    it('Should remove a transaction', () => {
        cy.route({
            method: 'DELETE',
            url:'/transacoes/**',
            response: {},
            status: 204
        }).as('del');

        cy.acessarMenuExtrato();
        cy.removerMovimentacoes('Telefone');
        cy.get(locators.Messages.message_sucess).should('contain','sucesso');
    });

    it('Should validate data send to create an account', () => {
        // const reqStub = cy.stub();
        cy.route({
            method: 'POST',
            url: '/contas',
            response: { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 },
            onRequest: req => {
                expect(req.request.body.nome).to.be.not.empty;
                expect(req.request.headers).to.have.property('Authorization');
            }
            // onRequest: reqStub
        }).as('saveContas');

        cy.acessarMenuConta();

        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                {id:1,nome:'Carteira',visivel:true,usuario_id:1},
                {id:2,nome:'Banco',visivel:true,usuario_id:1},
                {id: 3,nome:'Conta de teste',visivel:true,usuario_id:1}
            ]
            
        }).as('contasSave');

        cy.inserirConta('Conta teste 123');
        cy.wait('@saveContas').its('request.body.nome').should('not.be.empty');
        // cy.wait('@saveContas').then(() => {
        //     expect(reqStub.args[0][0].request.body.nome).to.be.not.empty;
        //     expect(reqStub.args[0][0].request.headers).to.have.property('Authorization');
        // });
        cy.get(locators.Messages.message_sucess).should('contain','Conta inserida com sucesso!');
    });

    it('Should test colors', () => {
        cy.route({
            method: 'GET',
            url: '/extrato/**',
            response: [
                {
                    "conta":"Conta para movimentacoes",
                    "id":286072,
                    "descricao":"Receita Paga",
                    "envolvido":"Douglas",
                    "observacao":null,
                    "tipo":"REC",
                    "data_transacao":"2020-11-02T03:00:00.000Z",
                    "data_pagamento":"2020-11-02T03:00:00.000Z",
                    "valor":"150.00",
                    "status":true,
                    "conta_id":312537,
                    "usuario_id":12072,
                    "transferencia_id":null,
                    "parcelamento_id":null
                 },
                 {
                    "conta":"Conta mesmo nome",
                    "id":286145,
                    "descricao":"Despesa Paga",
                    "envolvido":"Marcio",
                    "observacao":null,
                    "tipo":"DESP",
                    "data_transacao":"2020-11-02T03:00:00.000Z",
                    "data_pagamento":"2020-11-02T03:00:00.000Z",
                    "valor":"115.00",
                    "status":true,
                    "conta_id":312536,
                    "usuario_id":12072,
                    "transferencia_id":null,
                    "parcelamento_id":null
                 },
                 {
                    "conta":"Conta mesmo nome",
                    "id":286146,
                    "descricao":"Receita Pendente",
                    "envolvido":"José",
                    "observacao":null,
                    "tipo":"REC",
                    "data_transacao":"2020-11-02T03:00:00.000Z",
                    "data_pagamento":"2020-11-02T03:00:00.000Z",
                    "valor":"67.00",
                    "status":false,
                    "conta_id":312536,
                    "usuario_id":12072,
                    "transferencia_id":null,
                    "parcelamento_id":null
                 },
                 {
                    "conta":"Conta mesmo nome",
                    "id":286146,
                    "descricao":"Despesa Pendente",
                    "envolvido":"José",
                    "observacao":null,
                    "tipo":"DESP",
                    "data_transacao":"2020-11-02T03:00:00.000Z",
                    "data_pagamento":"2020-11-02T03:00:00.000Z",
                    "valor":"67.00",
                    "status":false,
                    "conta_id":312536,
                    "usuario_id":12072,
                    "transferencia_id":null,
                    "parcelamento_id":null
                 }
            ]
        })
        cy.acessarMenuExtrato();       
        cy.xpath(locators.Extrato.fn_xp_linha('Receita Paga')).should('have.class', 'receitaPaga');
        cy.xpath(locators.Extrato.fn_xp_linha('Receita Pendente')).should('have.class', 'receitaPendente');
        cy.xpath(locators.Extrato.fn_xp_linha('Despesa Paga')).should('have.class', 'despesaPaga');
        cy.xpath(locators.Extrato.fn_xp_linha('Despesa Pendente')).should('have.class', 'despesaPendente');
    });

});