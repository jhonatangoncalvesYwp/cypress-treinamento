// Bloco 3.3 — Boas Práticas e Antipadrões

import LoginPage from '../../pages/LoginPage'

describe('6 — teste sem asserção', () => {
  it('deve redirecionar para a home do admin após login válido', () => {
    LoginPage.logar('admin.treinamento@qa.com', 'treino123')
    cy.url().should('include', '/admin/home')
    cy.contains('h1', 'Bem Vindo').should('be.visible')
  })
})

describe('9 — if decidindo o que validar', () => {
  // O teste cria a condição que quer validar, e então afirma sem desvio.
  it('deve exibir exatamente os produtos retornados pela API', () => {
    cy.intercept('GET', '**/produtos*', { fixture: 'produtos-mock.json' }).as('produtos')

    cy.loginViaApi()
    cy.visit('/admin/listarprodutos')
    cy.wait('@produtos')

    cy.get('table.table-striped tbody tr').should('have.length', 2)
  })
})
