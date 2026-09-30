// Exemplo — configuração do Cypress para uma aplicação com login SAML 2.0.
// Aponta para os contêineres de docker/. Na sua empresa, troque baseUrl e
// idpUrl pelos endereços de lá.
//
// Rode a partir da raiz do projeto:
//   npx cypress run --config-file exemplos/saml-2.0/cypress.config.js

const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // A aplicação sob teste: no SAML ela é o Service Provider (SP).
    baseUrl: 'http://localhost:4000',

    // Provedores como Entra ID (Azure AD), ADFS e Okta têm código que detecta
    // que a página está dentro de um iframe (é assim que o Cypress roda) e se
    // recusa a abrir. Com esta opção, o Cypress neutraliza esse código nas
    // páginas de terceiros. O IdP de teste não precisa; ligue se a tela de
    // login da sua empresa não abrir dentro do Cypress.
    experimentalModifyObstructiveThirdPartyCode: false,

    // Só porque o exemplo mora fora da pasta cypress/. No projeto real, os
    // arquivos vão para os lugares de sempre e estas duas linhas saem.
    specPattern: 'exemplos/saml-2.0/*.cy.js',
    supportFile: 'exemplos/saml-2.0/login-saml.js',

    env: {
      // Endereço do provedor de identidade (IdP), a tela de login.
      idpUrl: 'http://127.0.0.1:8180'
      // Usuário e senha NÃO ficam aqui. Vêm de variáveis de ambiente:
      //   CYPRESS_samlUsuario e CYPRESS_samlSenha
    }
  }
})
