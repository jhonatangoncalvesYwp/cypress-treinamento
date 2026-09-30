// Bloco 3.8 — Code review: o codigo-para-revisar.js, corrigido
//
// O gabarito, problema por problema:
//
//   teste 1, teste 2, teste 3 ........ nome vago (antipadrão 8)
//   .form-control .eq(0), .btn-primary seletor por classe e posição, e existe
//                                      data-testid (antipadrão 3)
//   cy.wait(3000) .................... espera por tempo (antipadrão 1)
//   login pela tela em cada teste .... setup lento (antipadrão 5)
//   o mesmo login copiado duas vezes . repetição: comando ou Page Object
//   'Mouse Gamer' fixo ............... massa fixa: a 2ª execução falha com
//                                      "Já existe produto com esse nome" (antipadrão 4)
//   teste 1 não confere nada ......... sem asserção (antipadrão 6)
//   teste 2 depende do teste 1 ....... dependência de ordem (antipadrão 2)
//   if no teste 2 .................... nunca falha (antipadrão 9)
//   token de uma pessoa no código .... segredo real, e expira em 10 min
//   id e URL da API fixos ............ massa fixa; ignora o apiUrl do config
//   DELETE sem asserção .............. excluir id inexistente responde 200
//                                      "Nenhum registro excluído": passa sem
//                                      excluir nada
//   teste comentado .................. dívida silenciosa (antipadrão 10)

import ProdutosPage from '../../pages/ProdutosPage'

describe('Produtos — cadastro e exclusão', () => {
  // Login pela API, uma vez só, para todos os testes do arquivo.
  beforeEach(() => {
    cy.loginViaApi()
  })

  it('deve exibir na listagem o produto cadastrado pela interface', () => {
    const produto = { nome: `Mouse Gamer ${Date.now()}`, preco: 150, descricao: 'Mouse com RGB', quantidade: 10 }

    cy.intercept('POST', '**/produtos').as('criarProduto')
    ProdutosPage.cadastrar(produto)
    cy.wait('@criarProduto').its('response.statusCode').should('eq', 201)

    // O teste confere o próprio produto: não depende de nenhum outro ter rodado.
    ProdutosPage.visitarListagem().validarProdutoNaListagem(produto.nome)
  })

  it('deve excluir pela API um produto existente', () => {
    cy.cadastrarProdutoViaApi().then((produto) => {
      cy.obterToken().then((token) => {
        cy.request({
          method: 'DELETE',
          url: `${Cypress.env('apiUrl')}/produtos/${produto._id}`,
          headers: { authorization: token }
        })
          .its('body.message')
          .should('eq', 'Registro excluído com sucesso')
      })
    })
  })
})
