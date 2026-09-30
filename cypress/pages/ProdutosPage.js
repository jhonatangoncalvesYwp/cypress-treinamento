import { cadastroProduto, listagem } from '../support/selectors'

class ProdutosPage {
  seletores = { ...cadastroProduto, ...listagem }

  visitarCadastro() {
    cy.visit('/admin/cadastrarprodutos')
    return this
  }

  visitarListagem() {
    cy.visit('/admin/listarprodutos')
    return this
  }

  cadastrar({ nome, preco, descricao, quantidade }) {
    this.visitarCadastro()
    cy.get(this.seletores.nome).type(nome)
    cy.get(this.seletores.preco).type(preco)
    cy.get(this.seletores.descricao).type(descricao)
    cy.get(this.seletores.quantidade).type(quantidade)
    cy.get(this.seletores.cadastrar).click()
    return this
  }

  validarProdutoNaListagem(nome) {
    cy.get(this.seletores.tabela).should('be.visible').and('contain', nome)
    return this
  }

  validarProdutoForaDaListagem(nome) {
    cy.get(this.seletores.tabela).should('be.visible').and('not.contain', nome)
    return this
  }

  // A linha não tem data-testid: a âncora é o nome do produto. Acha a linha
  // que fala dele e, dentro dela, o botão Excluir.
  excluirProduto(nome) {
    cy.contains(this.seletores.linhas, nome).contains('button', 'Excluir').click()
    return this
  }
}

export default new ProdutosPage()
