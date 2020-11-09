/// <reference types="cypress"/>

describe('', () => {
    before(() => {
        cy.visit('http://www.wcaquino.me/cypress/componentes.html');
    });

    beforeEach(() => {
        cy.reload();
    });

    it('using jquery selector', () => {
        cy.get(':nth-child(1) > :nth-child(3) > [type="button"]');
        cy.get('table#tabelaUsuarios tbody > tr:eq(0) td:nth-child(3) > input').click();
        cy.get("[onClick*='Francisco']");
    });

    it('using xpath', () => {
        cy.xpath("//input[contains(@onclick, 'Francisco')]").click();
        cy.xpath("//table[@id='tabelaUsuarios']//td[contains(.,'Francisco')]/..//input[@type='text']").click();
    });
});