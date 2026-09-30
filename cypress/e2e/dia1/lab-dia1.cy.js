// Bloco 1.8 — Lab do Dia 1: resolução

describe('Lab Dia 1 — autenticação e cadastro', () => {
  const ADMIN = { email: 'admin.treinamento@qa.com', senha: 'treino123' }

  // No beforeEach, não no topo do arquivo: assim cada teste ganha um e-mail novo.
  // No topo, o Date.now() rodaria uma vez só para o arquivo inteiro. Dois testes
  // abaixo cadastram com ele: o segundo receberia "Este email já está sendo
  // usado" logo no primeiro cadastro, e falharia pelo motivo errado.
  let emailNovo

  beforeEach(() => {
    emailNovo = `lab1_${Date.now()}_${Cypress._.random(1000)}@qa.com`
  })

  it('deve redirecionar para a home do admin após login válido', () => {
    cy.visit('/login')
    cy.get('[data-testid="email"]').type(ADMIN.email)
    cy.get('[data-testid="senha"]').type(ADMIN.senha)
    cy.get('[data-testid="entrar"]').click()

    cy.url().should('include', '/admin/home')
    cy.contains('h1', 'Bem Vindo').should('be.visible')
  })

  it('deve exibir mensagem de erro ao informar senha inválida', () => {
    cy.visit('/login')
    cy.get('[data-testid="email"]').type(ADMIN.email)
    cy.get('[data-testid="senha"]').type('senhaerrada')
    cy.get('[data-testid="entrar"]').click()

    cy.get('.alert').should('be.visible').and('contain', 'Email e/ou senha inválidos')
    cy.url().should('include', '/login')
  })

  it('deve cadastrar um novo usuário com e-mail único', () => {
    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="nome"]').type('Usuário do Lab')
    // Atenção: na tela de CADASTRO o campo é "password", não "senha".
    cy.get('[data-testid="password"]').type('teste123')
    cy.get('[data-testid="email"]').type(emailNovo)
    cy.get('[data-testid="cadastrar"]').click()

    cy.get('.alert').should('contain', 'Cadastro realizado com sucesso')
  })

  it('deve impedir o cadastro de um e-mail já existente', () => {
    // O e-mail "existente" é cadastrado pelo próprio teste, primeiro. Usar o do
    // admin parece mais simples — mas se ele tiver sumido do ambiente
    // compartilhado, o teste o recriaria como usuário comum e derrubaria a
    // suíte da turma inteira. Aconteceu em 27/09/2026.
    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="nome"]').type('Usuário do Lab')
    cy.get('[data-testid="email"]').type(emailNovo)
    cy.get('[data-testid="password"]').type('teste123')
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('.alert').should('contain', 'Cadastro realizado com sucesso')

    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="nome"]').type('Usuário do Lab')
    cy.get('[data-testid="email"]').type(emailNovo)
    cy.get('[data-testid="password"]').type('teste123')
    cy.get('[data-testid="cadastrar"]').click()

    cy.get('.alert').should('contain', 'Este email já está sendo usado')
  })

  it('deve encerrar a sessão ao clicar em logout', () => {
    // Este teste precisa de sessão. Ele a cria — não herda do teste anterior.
    cy.visit('/login')
    cy.get('[data-testid="email"]').type(ADMIN.email)
    cy.get('[data-testid="senha"]').type(ADMIN.senha)
    cy.get('[data-testid="entrar"]').click()
    cy.url().should('include', '/admin/home')

    cy.get('[data-testid="logout"]').click()

    cy.url().should('include', '/login')
    cy.get('[data-testid="entrar"]').should('be.visible')
  })
})
