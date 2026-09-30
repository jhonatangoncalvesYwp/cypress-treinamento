// Bloco 3.8 — Lab final: resolução

import ProdutosPage from '../../pages/ProdutosPage'

const produtosFixture = require('../../fixtures/produtos.json')

describe('Lab Final — preparação e interface', () => {
  let admin

  // Parte 1: o próprio teste cria o administrador e obtém o token dele.
  beforeEach(() => {
    cy.criarUsuarioViaApi({ nome: 'Admin do Lab', administrador: 'true' }).then((usuario) => {
      admin = usuario
      cy.obterToken(admin.email, admin.password).should('contain', 'Bearer')
      cy.loginViaApi(admin.email, admin.password)
    })
  })

  it('deve exibir na tela o produto criado via API', () => {
    cy.intercept('GET', '**/produtos*').as('listagem')

    const dados = { nome: `Lab Final ${Date.now()}`, email: admin.email, senha: admin.password }
    cy.cadastrarProdutoViaApi(dados).then((produto) => {
      ProdutosPage.visitarListagem()

      cy.wait('@listagem').its('response.statusCode').should('eq', 200)
      ProdutosPage.validarProdutoNaListagem(produto.nome)
    })
  })

  it('deve remover o produto da listagem ao excluí-lo pela interface', () => {
    const dados = { nome: `Lab Final Excluir ${Date.now()}`, email: admin.email, senha: admin.password }
    cy.cadastrarProdutoViaApi(dados).then((produto) => {
      ProdutosPage.visitarListagem()
        .validarProdutoNaListagem(produto.nome)
        .excluirProduto(produto.nome)
        .validarProdutoForaDaListagem(produto.nome)
    })
  })
})

describe('Lab Final — data driven', () => {
  // O ServeRest recusa nome repetido: o sufixo deixa rodar duas vezes seguidas.
  const sufixo = `${Date.now()}`

  // Cada teste cadastra E valida o próprio produto. Um último teste que
  // contasse os anteriores dependeria da ordem: o antipadrão 2.
  produtosFixture.forEach((produto) => {
    it(`deve cadastrar "${produto.nome}" via API`, () => {
      cy.cadastrarProdutoViaApi({ ...produto, nome: `${produto.nome} ${sufixo}` }).then((criado) => {
        cy.request('GET', `${Cypress.env('apiUrl')}/produtos/${criado._id}`)
          .its('body')
          .should('include', { preco: produto.preco, quantidade: produto.quantidade })
      })
    })
  })
})

describe('Lab Final — resiliência', () => {
  it('deve evidenciar que a listagem não trata erro 500', () => {
    cy.intercept('GET', '**/produtos*', { statusCode: 500, body: {} }).as('erro500')

    // Captura a exceção para AFIRMAR que ela acontece, em vez de escondê-la.
    const erros = []
    cy.on('uncaught:exception', (err) => {
      erros.push(err.message)
      return false
    })

    cy.loginViaApi()
    ProdutosPage.visitarListagem()
    cy.wait('@erro500').its('response.statusCode').should('eq', 500)

    cy.wrap(erros).should((lista) => {
      expect(lista.join(' '), 'a listagem quebra em vez de avisar o usuário').to.contain('undefined')
    })
  })
})
