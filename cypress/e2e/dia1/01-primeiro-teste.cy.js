// Bloco 1.4 — Quick Start e Test Runner
//
// Anatomia: describe agrupa, it é um teste, cy.<comando> age, .should afirma.

describe('Página de login', () => {
  it('deve carregar a tela de login', () => {
    cy.visit('/login')

    cy.get('[data-testid="email"]').should('be.visible')
    cy.get('[data-testid="senha"]').should('be.visible')
    cy.contains('button', 'Entrar').should('be.visible')
  })

  it('deve permitir login com credenciais válidas de administrador', () => {
    cy.visit('/login')
    cy.get('[data-testid="email"]').type('admin.treinamento@qa.com')
    cy.get('[data-testid="senha"]').type('treino123')
    cy.get('[data-testid="entrar"]').click()

    cy.url().should('include', '/admin/home')
    cy.contains('h1', 'Bem Vindo').should('be.visible')
  })

  it('deve exibir mensagem de erro ao informar senha inválida', () => {
    cy.visit('/login')
    cy.get('[data-testid="email"]').type('admin.treinamento@qa.com')
    cy.get('[data-testid="senha"]').type('senhaerrada')
    cy.get('[data-testid="entrar"]').click()

    cy.get('.alert').should('contain', 'Email e/ou senha inválidos')
    cy.url().should('include', '/login')
  })
})
