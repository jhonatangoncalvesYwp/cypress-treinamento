// Bloco 2.4 — cy.intercept e Login via API

const apiUrl = Cypress.env('apiUrl')

// A porta dos fundos: pede o token à API e grava onde o front procura.
// O cy.visit('/login') antes de gravar é o que define ONDE o localStorage fica.
function entrarViaApi() {
  cy.request('POST', `${apiUrl}/login`, {
    email: 'admin.treinamento@qa.com',
    password: 'treino123'
  }).then((res) => {
    cy.visit('/login')
    cy.window().then((win) => {
      win.localStorage.setItem('serverest/userToken', res.body.authorization)
      win.localStorage.setItem('serverest/userNome', 'Administrador do Treinamento')
    })
  })
}

describe('Login via API', () => {
  it('deve entrar sem passar pela tela de login', () => {
    entrarViaApi()
    cy.visit('/admin/home')
    cy.contains('h1', 'Bem Vindo').should('be.visible')
  })

  it('deve voltar para o login quando não há token', () => {
    cy.visit('/admin/home')
    cy.url().should('include', '/login')
  })
})

describe('Uso 1 — espiar e esperar', () => {
  it('deve esperar a listagem de produtos carregar', () => {
    cy.intercept('GET', '**/produtos*').as('listagemProdutos')

    entrarViaApi()
    cy.visit('/admin/listarprodutos')

    cy.wait('@listagemProdutos').its('response.statusCode').should('eq', 200)
    cy.contains('h1', 'Lista dos Produtos').should('be.visible')
  })
})

describe('Uso 2 — simular a resposta', () => {
  beforeEach(() => {
    entrarViaApi()
  })

  it('deve exibir apenas os produtos da fixture', () => {
    cy.intercept('GET', '**/produtos*', { fixture: 'produtos-mock.json' }).as('produtosMock')

    cy.visit('/admin/listarprodutos')
    cy.wait('@produtosMock')

    cy.get('table.table-striped tbody tr').should('have.length', 2)
    cy.contains('td', 'Produto Simulado A').should('be.visible')
  })

  it('deve exibir a tabela vazia quando não há produtos', () => {
    cy.intercept('GET', '**/produtos*', { body: { quantidade: 0, produtos: [] } }).as('semProdutos')

    cy.visit('/admin/listarprodutos')
    cy.wait('@semProdutos')

    cy.get('table.table-striped tbody tr').should('have.length', 0)
  })
})

describe('Uso 3 — forçar o que não dá para reproduzir à mão', () => {
  it('deve expor que a tela não trata o erro 500 do servidor', () => {
    cy.intercept('GET', '**/produtos*', { statusCode: 500, body: {} }).as('erroServidor')

    const erros = []
    cy.on('uncaught:exception', (err) => {
      erros.push(err.message)
      return false
    })

    entrarViaApi()
    cy.visit('/admin/listarprodutos')
    cy.wait('@erroServidor').its('response.statusCode').should('eq', 500)

    cy.wrap(erros).should((lista) => {
      expect(lista.join(' '), 'a tela quebra em vez de mostrar uma mensagem').to.contain('undefined')
    })
  })
})
