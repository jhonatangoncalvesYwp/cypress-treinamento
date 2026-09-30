// Exemplo — testes que usam o login SAML. No projeto real, vão em cypress/e2e/.

describe('Área logada via SAML', () => {
  beforeEach(() => {
    cy.loginSaml()
    // Depois do cy.session a página fica em branco: o visit é obrigatório.
    cy.visit('/painel')
  })

  it('deve exibir o painel para o usuário autenticado', () => {
    cy.get('[data-testid="usuario-logado"]').should('be.visible')
  })

  // O segundo teste não passa pelo IdP: o log mostra a sessão restaurada.
  it('deve reconhecer o usuário autenticado na API', () => {
    cy.request('/api/usuario-logado').its('status').should('eq', 200)
  })
})
