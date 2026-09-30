// Bloco 1.6 — Hooks e Independência de Testes

describe('Cadastro de usuário', () => {
  let emailUnico

  before(() => {
    cy.log('roda uma vez, antes de todos os testes')
  })

  beforeEach(() => {
    emailUnico = `usuario_${Date.now()}@qa.com`
    cy.visit('/cadastrarusuarios')
  })

  afterEach(() => {
    cy.log('roda depois de cada teste')
  })

  after(() => {
    cy.log('roda uma vez, no final')
  })

  it('deve cadastrar um usuário comum', () => {
    cy.get('[data-testid="nome"]').type('Usuário Comum')
    cy.get('[data-testid="email"]').type(emailUnico)
    cy.get('[data-testid="password"]').type('teste123')
    cy.get('[data-testid="cadastrar"]').click()

    cy.get('.alert').should('contain', 'Cadastro realizado com sucesso')
  })

  it('deve cadastrar um usuário administrador', () => {
    cy.get('[data-testid="nome"]').type('Usuário Administrador')
    cy.get('[data-testid="email"]').type(emailUnico)
    cy.get('[data-testid="password"]').type('teste123')
    cy.get('[data-testid="checkbox"]').check()
    cy.get('[data-testid="cadastrar"]').click()

    cy.get('.alert').should('contain', 'Cadastro realizado com sucesso')
    cy.url().should('include', '/admin/home')
  })
})

describe('Testes independentes', () => {
  it('deve fazer login com um usuário criado pelo próprio teste', () => {
    const email = `independente_${Date.now()}@qa.com`

    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="nome"]').type('Usuário Independente')
    cy.get('[data-testid="email"]').type(email)
    cy.get('[data-testid="password"]').type('teste123')
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('.alert').should('contain', 'Cadastro realizado com sucesso')

    cy.visit('/login')
    cy.get('[data-testid="email"]').type(email)
    cy.get('[data-testid="senha"]').type('teste123')
    cy.get('[data-testid="entrar"]').click()
    cy.contains('h1', 'Serverest Store').should('be.visible')
  })
})
