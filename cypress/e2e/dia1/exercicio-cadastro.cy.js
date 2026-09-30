// Bloco 1.5 — Exercício: suíte de cadastro, três cenários (resolução)

describe('Exercício 1.5 — cadastro de usuário', () => {
  it('deve cadastrar um usuário com e-mail único', () => {
    const email = `exercicio_${Date.now()}@qa.com`

    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="nome"]').type('Usuário do Exercício')
    cy.get('[data-testid="email"]').type(email)
    // Na tela de cadastro o campo é "password", não "senha".
    cy.get('[data-testid="password"]').type('teste123')
    cy.get('[data-testid="cadastrar"]').click()

    cy.get('.alert').should('contain', 'Cadastro realizado com sucesso')
  })

  it('deve impedir o cadastro de um e-mail já existente', () => {
    // O e-mail "existente" é cadastrado aqui mesmo. Nunca o do admin.
    const email = `existente_${Date.now()}@qa.com`

    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="nome"]').type('Usuário do Exercício')
    cy.get('[data-testid="email"]').type(email)
    cy.get('[data-testid="password"]').type('teste123')
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('.alert').should('contain', 'Cadastro realizado com sucesso')

    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="nome"]').type('Usuário do Exercício')
    cy.get('[data-testid="email"]').type(email)
    cy.get('[data-testid="password"]').type('teste123')
    cy.get('[data-testid="cadastrar"]').click()

    cy.get('.alert').should('contain', 'Este email já está sendo usado')
  })

  it('deve exigir o nome quando o campo fica vazio', () => {
    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="email"]').type(`sem_nome_${Date.now()}@qa.com`)
    cy.get('[data-testid="password"]').type('teste123')
    cy.get('[data-testid="cadastrar"]').click()

    cy.get('.alert').should('contain', 'Nome é obrigatório')
    cy.url().should('include', '/cadastrarusuarios')
  })
})
