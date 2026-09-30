// Bloco 2.8 — Lab do Dia 2: resolução

import LoginPage from '../../pages/LoginPage'

const cenariosInvalidos = require('../../fixtures/login-invalido.json')

describe('Lab Dia 2 — API e interface', () => {
  it('deve cadastrar um produto via API e encontrá-lo na tela', () => {
    cy.criarUsuarioViaApi({ administrador: 'true' }).then((admin) => {
      cy.cadastrarProdutoViaApi({
        nome: `Lab2 ${Date.now()}`,
        email: admin.email,
        senha: admin.password
      }).then((produto) => {
        cy.request('GET', `${Cypress.env('apiUrl')}/produtos/${produto._id}`)
          .its('body.nome')
          .should('eq', produto.nome)

        cy.loginViaApi(admin.email, admin.password)
        cy.visit('/admin/listarprodutos')
        cy.contains('td', produto.nome).should('be.visible')
      })
    })
  })

  it('deve validar o status da requisição de listagem', () => {
    // O intercept vem ANTES do visit. Registrado depois, não pega a chamada.
    cy.intercept('GET', '**/produtos*').as('listagem')

    cy.loginViaApi()
    cy.visit('/admin/listarprodutos')

    cy.wait('@listagem').its('response.statusCode').should('eq', 200)
    cy.contains('h1', 'Lista dos Produtos').should('be.visible')
  })
})

describe('Lab Dia 2 — data driven', () => {
  cenariosInvalidos.forEach((caso) => {
    it(`deve exibir erro quando ${caso.cenario}`, () => {
      LoginPage.logar(caso.email, caso.senha).validarMensagemErro(caso.mensagemEsperada)
    })
  })
})
