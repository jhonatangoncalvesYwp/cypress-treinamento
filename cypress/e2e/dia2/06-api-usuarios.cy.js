// Bloco 2.3 — Testes de API com cy.request

const apiUrl = Cypress.env('apiUrl')

describe('API de usuários — leitura', () => {
  it('deve listar usuários', () => {
    cy.request('GET', `${apiUrl}/usuarios`).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.usuarios).to.be.an('array')
      expect(res.body.usuarios.length).to.eq(res.body.quantidade)
    })
  })

  it('deve filtrar usuário por e-mail', () => {
    cy.request('GET', `${apiUrl}/usuarios?email=admin.treinamento@qa.com`).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.quantidade).to.eq(1)
      expect(res.body.usuarios[0].administrador).to.eq('true')
    })
  })
})

describe('API de usuários — escrita', () => {
  it('deve cadastrar um novo usuário', () => {
    const usuario = {
      nome: 'Usuário Treinamento',
      email: `treino_${Date.now()}@qa.com`,
      password: 'teste123',
      administrador: 'true'
    }

    cy.request('POST', `${apiUrl}/usuarios`, usuario).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body.message).to.eq('Cadastro realizado com sucesso')
    })
  })

  it('deve impedir cadastro com e-mail duplicado', () => {
    // O e-mail repetido é do próprio teste. O do admin, nunca (bloco 1.5).
    const usuario = {
      nome: 'Usuário Duplicado',
      email: `duplicado_${Date.now()}@qa.com`,
      password: 'teste123',
      administrador: 'false'
    }
    cy.request('POST', `${apiUrl}/usuarios`, usuario)

    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: usuario,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.message).to.eq('Este email já está sendo usado')
    })
  })

  it('deve recusar cadastro sem os campos obrigatórios', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: { nome: 'Sem o resto' },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.email).to.eq('email é obrigatório')
      expect(res.body.password).to.eq('password é obrigatório')
    })
  })

  it('deve criar, consultar e excluir um usuário', () => {
    const usuario = {
      nome: 'Usuário Descartável',
      email: `descartavel_${Date.now()}@qa.com`,
      password: 'teste123',
      administrador: 'false'
    }

    cy.request('POST', `${apiUrl}/usuarios`, usuario).then((criado) => {
      const id = criado.body._id

      cy.request('GET', `${apiUrl}/usuarios/${id}`).its('body.email').should('eq', usuario.email)

      cy.request('DELETE', `${apiUrl}/usuarios/${id}`).its('body.message').should('eq', 'Registro excluído com sucesso')

      cy.request({ method: 'GET', url: `${apiUrl}/usuarios/${id}`, failOnStatusCode: false })
        .its('status')
        .should('eq', 400)
    })
  })
})
