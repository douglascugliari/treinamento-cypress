const buildEnv = () => {

    cy.server()

    cy.route({
        method: 'POST',
        url: '/signin',
        response: {
            id:10000,
            nome:'User Mock',
            token:'Uma string muito grande que representa o token falso'
        }
    }).as('signin');
    
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

    cy.route({
        method: 'GET',
        url: '/contas',
        response: [
            {id:1,nome:'Carteira',visivel:true,usuario_id:1},
            {id:2,nome:'Banco',visivel:true,usuario_id:1},
        ]
        
    }).as('contas');

    cy.route({
        method: 'GET',
        url: '/extrato/**',
        response: 'fixture:movimentacaoSalva'
        
    }).as('extrato');

}

export default buildEnv;