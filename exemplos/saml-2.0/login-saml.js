// Exemplo — comando de login SAML 2.0. No projeto real, vai em
// cypress/support/commands.js.
//
// O fluxo (iniciado pela aplicação, o mais comum):
//   1. a aplicação redireciona para a tela de login do IdP (outro domínio)
//   2. o usuário digita as credenciais no IdP
//   3. o IdP devolve a asserção SAML para a aplicação, que cria a sessão

Cypress.Commands.add('loginSaml', (usuario = Cypress.env('samlUsuario'), senha = Cypress.env('samlSenha')) => {
  // cy.session faz o login uma vez e reaproveita os cookies nos testes
  // seguintes. Sem ele, cada teste passaria pelo IdP de novo: lento, e alguns
  // IdPs bloqueiam o usuário depois de muitos logins seguidos.
  cy.session(
    ['saml', usuario],
    () => {
      // Começa na aplicação: é ela que fica sendo a página "de cima" do teste.
      cy.visit('/login')
      cy.get('[data-testid="entrar-sso"]').click()

      // A tela de login é de outro domínio (o IdP). Todo comando que mexe nela
      // precisa estar dentro do cy.origin, que só enxerga o que recebe em
      // `args`: as variáveis de fora não existem lá dentro.
      cy.origin(Cypress.env('idpUrl'), { args: { usuario, senha } }, ({ usuario, senha }) => {
        // Seletores do IdP de teste. Na sua empresa, confira os da tela de login.
        cy.get('#username').type(usuario)
        cy.get('#password').type(senha, { log: false }) // não mostra a senha no log
        // Não pelo texto: o IdP traduz a tela conforme o idioma do navegador,
        // e o botão "Login" vira "Acessar" (a camada 4 do Bloco 1.7).
        cy.get('form[name="f"] button').click()
      })

      // De volta à aplicação: a asserção SAML foi aceita. Esta espera também
      // garante que a sessão só é guardada depois de o login terminar.
      cy.location('pathname').should('eq', '/painel')
    },
    {
      // Confere se a sessão guardada ainda vale. Se não valer, o login é refeito.
      // Troque pelo endereço da sua aplicação que só responde a quem está logado.
      validate() {
        cy.request('/api/usuario-logado').its('status').should('eq', 200)
      },
      // Reaproveita a sessão entre arquivos de teste, não só dentro de um.
      cacheAcrossSpecs: true
    }
  )
})
