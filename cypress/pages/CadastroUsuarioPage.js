import { cadastroUsuario } from '../support/selectors'

class CadastroUsuarioPage {
  seletores = cadastroUsuario

  visitar() {
    cy.visit('/cadastrarusuarios')
    return this
  }

  preencherFormulario({ nome, email, password }) {
    if (nome) cy.get(this.seletores.nome).type(nome)
    if (email) cy.get(this.seletores.email).type(email)
    if (password) cy.get(this.seletores.password).type(password)
    return this
  }

  marcarComoAdministrador() {
    cy.get(this.seletores.checkboxAdmin).check()
    return this
  }

  clicarCadastrar() {
    cy.get(this.seletores.cadastrar).click()
    return this
  }

  cadastrar(dados, { administrador = false } = {}) {
    this.visitar().preencherFormulario(dados)
    if (administrador) this.marcarComoAdministrador()
    return this.clicarCadastrar()
  }

  validarMensagem(mensagem) {
    cy.get(this.seletores.alerta, { timeout: 15000 }).should('be.visible').and('contain', mensagem)
    return this
  }
}

export default new CadastroUsuarioPage()
