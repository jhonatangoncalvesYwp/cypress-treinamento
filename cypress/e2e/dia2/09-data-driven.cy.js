// Bloco 2.5 — Testes Data Driven

const cenariosInvalidos = require('../../fixtures/login-invalido.json')

describe('Login — cenários inválidos', () => {
  cenariosInvalidos.forEach((caso) => {
    it(`deve exibir erro quando ${caso.cenario}`, () => {
      cy.visit('/login')

      if (caso.email) cy.get('[data-testid="email"]').type(caso.email)
      if (caso.senha) cy.get('[data-testid="senha"]').type(caso.senha)
      cy.get('[data-testid="entrar"]').click()

      cy.get('.alert', { timeout: 15000 }).should('be.visible').and('contain', caso.mensagemEsperada)
    })
  })
})

describe('Variáveis de ambiente', () => {
  it('deve ler as credenciais da configuração, não do código', () => {
    const email = Cypress.env('usuarioAdmin')
    const senha = Cypress.env('senhaAdmin')

    cy.request('POST', `${Cypress.env('apiUrl')}/login`, { email, password: senha })
      .its('status')
      .should('eq', 200)
  })
})

describe('Cadastro de produtos em lote', () => {
  const produtos = require('../../fixtures/produtos.json')
  // A fixture guarda o MODELO. O sufixo torna o nome único: o ServeRest recusa nome repetido.
  const sufixo = Date.now()

  produtos.forEach((produto) => {
    it(`deve cadastrar via API o produto "${produto.nome}"`, () => {
      cy.request('POST', `${Cypress.env('apiUrl')}/login`, {
        email: Cypress.env('usuarioAdmin'),
        password: Cypress.env('senhaAdmin')
      }).then((login) => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/produtos`,
          headers: { authorization: login.body.authorization },
          body: { ...produto, nome: `${produto.nome} ${sufixo}` }
        })
          .its('status')
          .should('eq', 201)
      })
    })
  })
})
