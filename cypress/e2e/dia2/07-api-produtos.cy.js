// Bloco 2.3 — Autenticação encadeada

const apiUrl = Cypress.env('apiUrl')

describe('API de produtos', () => {
  it('deve listar produtos sem autenticação', () => {
    cy.request('GET', `${apiUrl}/produtos`).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.produtos).to.be.an('array')
    })
  })

  it('deve recusar cadastro de produto sem token', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      body: { nome: `Sem token ${Date.now()}`, preco: 100, descricao: 'Não deve ser criado', quantidade: 1 },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body.message).to.contain('Token de acesso ausente')
    })
  })

  it('deve cadastrar produto autenticado', () => {
    cy.request('POST', `${apiUrl}/login`, {
      email: 'admin.treinamento@qa.com',
      password: 'treino123'
    }).then((login) => {
      const token = login.body.authorization

      cy.request({
        method: 'POST',
        url: `${apiUrl}/produtos`,
        headers: { authorization: token },
        body: { nome: `Produto ${Date.now()}`, preco: 100, descricao: 'Produto de treinamento', quantidade: 10 }
      }).then((res) => {
        expect(res.status).to.eq(201)
        expect(res.body.message).to.eq('Cadastro realizado com sucesso')
      })
    })
  })
})
