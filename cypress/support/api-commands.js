// Bloco 2.6 — comandos que falam com a API. Preparam estado; não mexem na tela.

const apiUrl = () => Cypress.env('apiUrl')

Cypress.Commands.add('obterToken', (email, senha) => {
  return cy
    .request('POST', `${apiUrl()}/login`, {
      email: email || Cypress.env('usuarioAdmin'),
      password: senha || Cypress.env('senhaAdmin')
    })
    .its('body.authorization')
})

// O `||` é o que torna o comando reutilizável: funciona sem argumento nenhum
// e aceita trocar só o que importa para o teste.
Cypress.Commands.add('criarUsuarioViaApi', (dados = {}) => {
  const usuario = {
    nome: dados.nome || 'Usuário Treinamento',
    email: dados.email || `user_${Date.now()}@qa.com`,
    password: dados.password || 'teste123',
    administrador: dados.administrador || 'true'
  }

  return cy
    .request('POST', `${apiUrl()}/usuarios`, usuario)
    .then((res) => ({ ...usuario, _id: res.body._id }))
})

// Exercício do bloco 2.6: o teste não precisa saber que existe token.
Cypress.Commands.add('cadastrarProdutoViaApi', (dados = {}) => {
  const produto = {
    nome: dados.nome || `Produto ${Date.now()}`,
    preco: dados.preco || 100,
    descricao: dados.descricao || 'Produto de treinamento',
    quantidade: dados.quantidade || 10
  }

  return cy.obterToken(dados.email, dados.senha).then((token) => {
    return cy
      .request({
        method: 'POST',
        url: `${apiUrl()}/produtos`,
        headers: { authorization: token },
        body: produto
      })
      .then((res) => ({ ...produto, _id: res.body._id }))
  })
})
