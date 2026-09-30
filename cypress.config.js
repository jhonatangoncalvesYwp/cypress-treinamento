const { defineConfig } = require('cypress')
// Bloco 3.4 — três peças para o Cypress entender arquivos .feature.
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const preprocessor = require('@badeball/cypress-cucumber-preprocessor')
const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild')

module.exports = defineConfig({
  // Bloco 3.6 — relatório em HTML, com gráfico e o print de cada falha.
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true
  },
  e2e: {
    baseUrl: 'http://localhost:3001',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    video: true,
    screenshotOnRunFailure: true,
    env: {
      apiUrl: 'http://localhost:3000',
      // Credencial de aplicação de estudo pode ficar aqui. Credencial real, nunca.
      usuarioAdmin: 'admin.treinamento@qa.com',
      senhaAdmin: 'treino123'
    },
    // A loja e a API rodam na sua máquina (serverest-treinamento, npm start).
    // Os 30 s são para o Plano B: no ServeRest público, a loja chegou a
    // levar 9 s para abrir. O padrão do Cypress é 60 s; 30 s dá folga
    // sem esconder uma queda de verdade.
    pageLoadTimeout: 30000,
    // Bloco 3.4 — além dos .cy.js, os arquivos .feature também são testes.
    specPattern: 'cypress/e2e/**/*.{cy.js,feature}',
    async setupNodeEvents(on, config) {
      await preprocessor.addCucumberPreprocessorPlugin(on, config)
      on('file:preprocessor', createBundler({ plugins: [createEsbuildPlugin.default(config)] }))
      require('cypress-mochawesome-reporter/plugin')(on)
      // Bloco 3.7 — o navegador não fala com banco; o Node fala.
      on('task', require('./cypress/tasks/banco'))
      return config
    }
  }
})