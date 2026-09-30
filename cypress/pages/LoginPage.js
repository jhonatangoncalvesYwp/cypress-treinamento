import { login } from '../support/selectors'

class LoginPage {
  seletores = login

  visitar() {
    cy.visit('/login')
    return this
  }

  preencherEmail(email) {
    // O if é preparação, não validação: o cenário "e-mail em branco" não digita nada.
    if (email) cy.get(this.seletores.email).type(email)
    return this
  }

  preencherSenha(senha) {
    if (senha) cy.get(this.seletores.senha).type(senha)
    return this
  }

  clicarEntrar() {
    cy.get(this.seletores.entrar).click()
    return this
  }

  logar(email, senha) {
    return this.visitar().preencherEmail(email).preencherSenha(senha).clicarEntrar()
  }

  validarMensagemErro(mensagem) {
    cy.get(this.seletores.alerta, { timeout: 15000 }).should('be.visible').and('contain', mensagem)
    return this
  }

  validarRedirecionamentoAdmin() {
    cy.url().should('include', '/admin/home')
    return this
  }
}

// Exporta um objeto pronto: o teste não precisa saber que existe uma classe.
export default new LoginPage()
