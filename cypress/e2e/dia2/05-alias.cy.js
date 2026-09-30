// Bloco 2.2 — Alias

describe('Alias de elemento', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('[data-testid="email"]').as('campoEmail')
    cy.get('[data-testid="senha"]').as('campoSenha')
    cy.get('[data-testid="entrar"]').as('botaoEntrar')
  })

  it('deve preencher os campos usando alias', () => {
    cy.get('@campoEmail').type('admin.treinamento@qa.com').should('have.value', 'admin.treinamento@qa.com')
    cy.get('@campoSenha').type('treino123')
    cy.get('@botaoEntrar').should('be.enabled')
  })
})

describe('Alias de dados', () => {
  beforeEach(() => {
    cy.fixture('usuarios').as('usuarios')
  })

  it('deve logar com o administrador lido da fixture', function () {
    cy.visit('/login')
    cy.get('[data-testid="email"]').type(this.usuarios.admin.email)
    cy.get('[data-testid="senha"]').type(this.usuarios.admin.password)
    cy.get('[data-testid="entrar"]').click()

    cy.url().should('include', '/admin/home')
  })

  it('deve logar lendo o alias dentro de um then', () => {
    cy.get('@usuarios').then((usuarios) => {
      cy.visit('/login')
      cy.get('[data-testid="email"]').type(usuarios.admin.email)
      cy.get('[data-testid="senha"]').type(usuarios.admin.password)
      cy.get('[data-testid="entrar"]').click()
    })

    cy.url().should('include', '/admin/home')
  })
})

describe('Alias de requisição', () => {
  it('deve esperar a requisição de login e validar a resposta', () => {
    cy.intercept('POST', '**/login').as('requisicaoLogin')

    cy.visit('/login')
    cy.get('[data-testid="email"]').type('admin.treinamento@qa.com')
    cy.get('[data-testid="senha"]').type('treino123')
    cy.get('[data-testid="entrar"]').click()

    cy.wait('@requisicaoLogin').then((intercepcao) => {
      expect(intercepcao.response.statusCode).to.eq(200)
      expect(intercepcao.response.body.authorization).to.contain('Bearer')
      expect(intercepcao.request.body.email).to.eq('admin.treinamento@qa.com')
    })
  })

  it('deve esperar a requisição e validar direto com its', () => {
    cy.intercept('POST', '**/login').as('requisicaoLogin')

    cy.visit('/login')
    cy.get('[data-testid="email"]').type('admin.treinamento@qa.com')
    cy.get('[data-testid="senha"]').type('senhaerrada')
    cy.get('[data-testid="entrar"]').click()

    cy.wait('@requisicaoLogin').its('response.statusCode').should('eq', 401)
    cy.get('.alert').should('contain', 'Email e/ou senha inválidos')
  })
})
