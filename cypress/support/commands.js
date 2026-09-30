// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Bloco 2.6 — comandos que interagem com a tela.

Cypress.Commands.add('login', (email, senha) => {
  cy.visit('/login')
  cy.get('[data-testid="email"]').type(email)
  cy.get('[data-testid="senha"]').type(senha)
  cy.get('[data-testid="entrar"]').click()
})

// A porta dos fundos do bloco 2.4, agora disponível para todos os testes.
Cypress.Commands.add('loginViaApi', (email, senha) => {
  email = email || Cypress.env('usuarioAdmin')
  senha = senha || Cypress.env('senhaAdmin')

  cy.request('POST', `${Cypress.env('apiUrl')}/login`, { email, password: senha }).then((res) => {
    cy.visit('/login')
    cy.window().then((win) => {
      win.localStorage.setItem('serverest/userToken', res.body.authorization)
    })
  })

  cy.request('GET', `${Cypress.env('apiUrl')}/usuarios?email=${email}`).then((res) => {
    cy.window().then((win) => {
      win.localStorage.setItem('serverest/userNome', res.body.usuarios[0].nome)
    })
  })
})

// Comando filho: continua a partir do elemento anterior.
// Uso: cy.get('h1').validarTexto('Bem Vindo')
Cypress.Commands.add('validarTexto', { prevSubject: true }, (elemento, texto) => {
  cy.wrap(elemento).should('contain', texto)
})
