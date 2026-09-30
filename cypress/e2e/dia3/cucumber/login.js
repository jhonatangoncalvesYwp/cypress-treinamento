import { Dado, Quando, E, Entao } from '../../../support/cucumber-pt'
import LoginPage from '../../../pages/LoginPage'

// Os passos chamam o MESMO Page Object do bloco 3.2.
// Cucumber é uma camada de expressão, não uma arquitetura paralela.

Dado('que estou na página de login', () => {
  LoginPage.visitar()
})

Quando('informo o e-mail {string} e a senha {string}', (email, senha) => {
  LoginPage.preencherEmail(email).preencherSenha(senha)
})

E('clico no botão entrar', () => {
  LoginPage.clicarEntrar()
})

Entao('devo visualizar a home do administrador', () => {
  LoginPage.validarRedirecionamentoAdmin()
})

Entao('devo ver a mensagem {string}', (mensagem) => {
  LoginPage.validarMensagemErro(mensagem)
})
