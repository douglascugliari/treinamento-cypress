const locators = {

    Login: {
        user: '[data-test="email"]',
        password: '[data-test="passwd"]',
        button_login: '.btn-primary'
    },
    Menu: {
        settings: '[data-test=menu-settings]',
        menu_contas: '[href="/contas"]',
        menu_reset: '[href="/reset"]',
        menu_movimentacoes: '[data-test=menu-movimentacao]',
        pagina_inicial: '[data-test=menu-home]',
        menu_extrato: '[data-test=menu-extrato]'
    },
    Conta : {
        message: '',
        nome_conta: '[data-test=nome]',
        button_salvar: '.btn',
        fn_xp_button_alterar: (nomeConta) => `//table//td[contains(.,'${nomeConta}')]/..//i[@class='far fa-edit']`
    },
    Messages : {
        message_sucess : '.toast-success .toast-message',
        button_fechar_message: '.toast-close-button',
        message_error: '.toast-error .toast-message'
    },
    Movimentacoes : {
        descricao: '[data-test=descricao]',
        valor: '[data-test=valor]',
        interessados: '[data-test=envolvido]',
        button_salvar: '.btn-primary',
        data_transacao: '[data-test=data-transacao]',
        data_pagamento: '[data-test=data-pagamento]',
        conta: '[data-test=conta]',
        status: '[data-test=status]',
        tipo_receita: '[data-test=tipo-receita]',
        tipo_despesa: '[data-test=tipo-despesa]'
    },
    Extrato: {
        linhas: '.list-group > li',
        fn_xp_busca_elemento: (descricao, valor) => `//span[contains(.,'${descricao}')]/following-sibling::small[contains(.,'${valor}')]`,
        fn_xp_remover_movimentacao: (descricao) => `//span[contains(., '${descricao}')]/../../..//i[@class='far fa-trash-alt']`,
        fn_xp_alterar_movimentacao: (descricao) => `//span[contains(., '${descricao}')]/../../..//i[@class='fas fa-edit']`,
        fn_xp_linha: (descricao) => `//span[contains(., '${descricao}')]/../../../..`
    },
    Saldo:{
        fn_xp_saldo_conta: (descricaoConta) => `//td[contains(., '${descricaoConta}')]/../td[2]`
    }
}

export default locators;