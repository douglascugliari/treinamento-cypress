/// <reference types="cypress" />


describe('Should test at a funcional level', () => {
    // let token;
    before(() => {
        cy.getToken('testedouglas@teste.com.br', '123456');
            // .then(tkn => {
            //     token = tkn;
            // });
      
    });

    beforeEach(() => {
        cy.resetRest('testedouglas@teste.com.br', '123456');
    });

    it('Should update an account', () => {
        cy.request({
            // headers: { Authorization: `JWT ${token}` },
            method: 'POST',
            url: '/contas',
            body:{
                nome: 'DouglasTeste' 
            }
        }).as('response')
     
        cy.get('@response').then(res => {
           expect(res.status).to.be.equal(201);
           expect(res.body).to.have.property('id');
           expect(res.body).to.have.property('nome', 'DouglasTeste')
        })
    });

    it('Should Update an Conta', () => {
        cy.getContaByName('Conta para alterar').then(contaId => {
            cy.request({
                // headers: { Authorization: `JWT ${token}` },
                method: 'PUT',
                url: `/contas/${contaId}`,
                body:{
                    nome: 'DouglasTeste via rest' 
                }
            }).as('response')
         
            cy.get('@response').its('status').should('be.equal', 200);
        })
        
    });

    it('Should not Create an account with same name', () => {
        cy.request({
            // headers: { Authorization: `JWT ${token}` },
            method: 'POST',
            url: '/contas',
            body:{
                nome: 'Conta mesmo nome' 
            },
            failOnStatusCode: false
        }).as('response')
     
        cy.get('@response').then(res => {
           expect(res.body.error).to.be.equal('Já existe uma conta com esse nome!');
           expect(res.status).to.be.equal(400);
        })
    });

    it('Should create a transaction', () => {
        cy.getContaByName('Conta para movimentacoes').then(contaId => {
            cy.request({
                // headers: { Authorization: `JWT ${token}` },
                method: 'POST',
                url: '/transacoes',
                body:{
                    conta_id: contaId,
                    data_pagamento: Cypress.moment().add({days: 1}).format('DD/MM/YYYY'),
                    data_transacao: Cypress.moment().format('DD/MM/YYYY'),
                    descricao: "Inclusão Movimentação Via Rest",
                    envolvido: "Douglas",
                    status: true,
                    tipo: "REC",
                    valor: "150" 
                }
            }).as('response')
         
            cy.get('@response').its('status').should('be.equal', 201);
            cy.get('@response').its('body.id').should('exist');
        })
    });

    it('Should get balance', () => {
        cy.request({
            // headers: { Authorization: `JWT ${token}` },
            method: 'GET',
            url: '/saldo',
        }).then(res => {
            let saldoConta = null;
            res.body.forEach((c) => {
                if(c.conta === 'Conta para saldo') saldoConta = c.saldo
            })
            expect(saldoConta).to.be.equal('534.00');
        })

        cy.request({
            // headers: { Authorization: `JWT ${token}` },
            method: 'GET',
            url: '/transacoes',
            qs: { descricao: 'Movimentacao 1, calculo saldo' }
        }).then(res => {
            cy.request({
                // headers: { Authorization: `JWT ${token}` },
                method: 'PUT',
                url: `/transacoes/${res.body[0].id}`,
                body: {
                    status: true,
                    data_transacao : Cypress.moment(res.body[0].data_transacao).format('DD/MM/YYYY'),
                    data_pagamento : Cypress.moment(res.body[0].data_pagamento).format('DD/MM/YYYY'),
                    descricao: res.body[0].descricao,
                    envolvido: res.body[0].envolvido,
                    valor: res.body[0].valor,
                    conta_id: res.body[0].conta_id
                }
            }).its('status').should('to.equal',200);
        })

        cy.request({
            // headers: { Authorization: `JWT ${token}` },
            method: 'GET',
            url: '/saldo',
        }).then(res => {
            let saldoConta = null;
            res.body.forEach((c) => {
                if(c.conta === 'Conta para saldo') saldoConta = c.saldo
            })
            expect(saldoConta).to.be.equal('4034.00');
        })

       
    });

    it('Should remove a transaction', () => {
        cy.request({
            // headers: { Authorization: `JWT ${token}` },
            method: 'GET',
            url: '/transacoes',
            qs: { descricao: 'Movimentacao para exclusao' }
        }).then(res => {
            cy.request({
                // headers: { Authorization: `JWT ${token}` },
                method: 'DELETE',
                url: `/transacoes/${res.body[0].id}`,
            }).its('status').should('to.equal',204);
        })
    });

});