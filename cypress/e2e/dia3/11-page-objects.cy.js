// Bloco 3.2 — Page Objects

import LoginPage from '../../pages/LoginPage'
import CadastroUsuarioPage from '../../pages/CadastroUsuarioPage'
import ProdutosPage from '../../pages/ProdutosPage'

describe('Login com Page Object', () => {
  it('deve redirecionar para a home do admin após login válido', () => {
    LoginPage.logar('admin.treinamento@qa.com', 'treino123').validarRedirecionamentoAdmin()
  })

  it('deve exibir erro com senha inválida', () => {
    LoginPage.logar('admin.treinamento@qa.com', 'senhaerrada').validarMensagemErro('Email e/ou senha inválidos')
  })

  // O `return this` de cada método é o que deixa o teste ler como uma frase.
  it('deve permitir montar o login passo a passo', () => {
    LoginPage.visitar()
      .preencherEmail('admin.treinamento@qa.com')
      .preencherSenha('treino123')
      .clicarEntrar()
      .validarRedirecionamentoAdmin()
  })
})

describe('Cadastro com Page Object', () => {
  it('deve cadastrar um usuário administrador', () => {
    const dados = { nome: 'Usuário Page Object', email: `po_${Date.now()}@qa.com`, password: 'teste123' }

    CadastroUsuarioPage.cadastrar(dados, { administrador: true }).validarMensagem('Cadastro realizado com sucesso')
  })

  it('deve impedir cadastro com e-mail já existente', () => {
    cy.criarUsuarioViaApi().then((existente) => {
      CadastroUsuarioPage.cadastrar({ nome: 'Fulano', email: existente.email, password: 'teste123' })
        .validarMensagem('Este email já está sendo usado')
    })
  })
})

describe('Produtos com Page Object', () => {
  beforeEach(() => {
    cy.loginViaApi()
  })

  it('deve cadastrar um produto pela interface', () => {
    const produto = { nome: `Produto PO ${Date.now()}`, preco: 199, descricao: 'Cadastrado pela tela', quantidade: 5 }

    // Espera o cadastro terminar antes de ir para a listagem: evento, não tempo.
    cy.intercept('POST', '**/produtos').as('criarProduto')
    ProdutosPage.cadastrar(produto)
    cy.wait('@criarProduto').its('response.statusCode').should('eq', 201)

    ProdutosPage.visitarListagem().validarProdutoNaListagem(produto.nome)
  })

  it('deve excluir um produto pela interface', () => {
    cy.cadastrarProdutoViaApi({ nome: `Produto a Excluir ${Date.now()}` }).then((produto) => {
      ProdutosPage.visitarListagem().validarProdutoNaListagem(produto.nome).excluirProduto(produto.nome)

      // Excluir não mostra mensagem nenhuma: a asserção é o produto ter sumido.
      ProdutosPage.validarProdutoForaDaListagem(produto.nome)
    })
  })
})
