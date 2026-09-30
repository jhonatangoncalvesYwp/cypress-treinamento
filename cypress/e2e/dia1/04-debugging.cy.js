// Bloco 1.7 — Seletores e Debugging

describe('Hierarquia de seletores', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('camada 1 — atributo dedicado a teste (preferir sempre)', () => {
    cy.get('[data-testid="entrar"]').should('be.visible')
  })

  it('camada 3 — atributo semântico, quando não há data-testid', () => {
    cy.get('input[name="email"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('camada 4 — texto visível, legível mas sensível a tradução', () => {
    cy.contains('button', 'Entrar').should('be.visible')
  })

  it('camada 5 — classe CSS, evitar: classe é decisão de estilo', () => {
    cy.get('.btn-primary').should('be.visible')
  })
})

describe('Teste quebrado — exercício de diagnóstico', () => {
  it('deve fazer login e chegar na home', () => {
    cy.visit('/login')
    cy.get('[data-testid="email"]').type('admin.treinamento@qa.com')
    cy.get('[data-testid="senha"]').type('treino123')
    cy.get('[data-testid="entrar"]').click()
    cy.contains('h1', 'Bem Vindo').should('be.visible')
  })
})
