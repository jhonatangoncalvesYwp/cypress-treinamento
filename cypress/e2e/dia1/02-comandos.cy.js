// Bloco 1.5 — Comandos e Asserções

describe('Comandos de navegação e consulta', () => {
  it('deve navegar e inspecionar a página', () => {
    cy.visit('/login')

    cy.url().should('include', '/login')
    cy.title().should('not.be.empty')

    cy.get('[data-testid="email"]').should('have.attr', 'type', 'email')
    cy.get('[data-testid="senha"]').should('have.attr', 'type', 'password')
  })

  it('deve encadear consulta a partir de um elemento pai', () => {
    cy.visit('/login')

    cy.get('form').find('input').should('have.length', 2)
  })

  it('deve interagir com os campos do formulário', () => {
    cy.visit('/login')

    cy.get('[data-testid="email"]').type('admin.treinamento@qa.com').should('have.value', 'admin.treinamento@qa.com')
    cy.get('[data-testid="email"]').clear().should('have.value', '')
  })

  it('deve marcar e desmarcar o checkbox de administrador', () => {
    cy.visit('/cadastrarusuarios')

    cy.get('[data-testid="checkbox"]').check().should('be.checked')
    cy.get('[data-testid="checkbox"]').uncheck().should('not.be.checked')
  })
})

describe('Asserções', () => {
  it('deve demonstrar as asserções mais usadas', () => {
    cy.visit('/login')

    cy.get('[data-testid="entrar"]')
      .should('be.visible')
      .and('exist')
      .and('contain', 'Entrar')
      .and('not.be.disabled')

    cy.get('[data-testid="naoExiste"]').should('not.exist')
    cy.get('form input').should('have.length', 2)
  })
})

describe('Comandos não são Promises', () => {
  it('deve ler o valor digitado no campo de e-mail', () => {
    cy.visit('/login')
    cy.get('[data-testid="email"]').type('admin.treinamento@qa.com')

    cy.get('[data-testid="email"]').should('have.value', 'admin.treinamento@qa.com')

    cy.get('[data-testid="email"]')
      .invoke('val')
      .then((valor) => {
        expect(valor).to.eq('admin.treinamento@qa.com')
      })
  })

  it('deve esperar por condição, não por tempo', () => {
    cy.visit('/login')
    cy.get('[data-testid="email"]').type('admin.treinamento@qa.com')
    cy.get('[data-testid="senha"]').type('senhaerrada')
    cy.get('[data-testid="entrar"]').click()

    cy.get('.alert').should('be.visible').and('contain', 'Email e/ou senha inválidos')
  })
})
