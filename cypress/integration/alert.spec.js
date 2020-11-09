/// <reference types="cypress" />

describe('Work with alerts', () => {
    
    before(() => {
        cy.visit('http://www.wcaquino.me/cypress/componentes.html');
    });

    beforeEach(() => {
        cy.reload();
    });
    
    it.only('Alert', () => {
        // cy.get('#alert').click();
        // cy.on('window:alert', msg => {
        //     console.log(msg);
        //     expect(msg).to.be.equal('Alert Simples');
        // })
        cy.clickAlert('#alert', 'Alert Simples')
    });

    it('Alert com mock', () => {
        const stub = cy.stub().as('alerta');
        cy.on('window:alert', stub );
        cy.get('#alert').click().then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Alert Simples');
        });
    });

    it('Alert confirm', () => {
        cy.get('#confirm').click();
        cy.on('window:confirm', msg => {
            expect(msg).to.be.equal('Confirm Simples');
        })

        cy.on('window:alert', msg => {
            expect(msg).to.be.equal('Confirmado');
        })
    });

    it('Alert Cancel', () => {
        cy.get('#confirm').click();
        cy.on('window:confirm', msg => {
            expect(msg).to.be.equal('Confirm Simples');
            return false;
        })

        cy.on('window:alert', msg => {
            expect(msg).to.be.equal('Negado');
        })
    });

    it('Alert prompt', () => {
       
        cy.window().then(win => {
            cy.stub(win, 'prompt').returns('42');
        })
        cy.get('#prompt').click();
        cy.on('window:confirm', msg => {
            expect(msg).to.be.equal('Era 42?');
        })

        cy.on('window:alert', msg => {
            expect(msg).to.be.equal(':D');
        })
    });
})