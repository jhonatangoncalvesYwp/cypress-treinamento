// Bloco 2.6 — Comandos Customizados

import { faker } from '@faker-js/faker/locale/pt_BR'

describe('Comandos de interface', () => {
  it('deve usar o comando login', () => {
    cy.login('admin.treinamento@qa.com', 'treino123')
    cy.url().should('include', '/admin/home')
  })

  it('deve usar o comando filho validarTexto', () => {
    cy.loginViaApi()
    cy.visit('/admin/home')
    cy.get('h1').validarTexto('Bem Vindo')
  })
})

describe('Comandos de API', () => {
  it('deve criar usuário sem informar nenhum dado', () => {
    cy.criarUsuarioViaApi().then((usuario) => {
      expect(usuario._id).to.not.be.empty
    })
  })

  it('deve criar usuário trocando só o nome', () => {
    cy.criarUsuarioViaApi({ nome: 'Nome Específico' }).then((usuario) => {
      expect(usuario.nome).to.eq('Nome Específico')
      expect(usuario.password).to.eq('teste123')
    })
  })

  it('deve criar um usuário e entrar com ele', () => {
    cy.criarUsuarioViaApi().then((usuario) => {
      cy.loginViaApi(usuario.email, usuario.password)
      cy.visit('/admin/home')
      cy.contains('h1', usuario.nome).should('be.visible')
    })
  })

  it('deve cadastrar produto via API', () => {
    cy.cadastrarProdutoViaApi({ nome: `Produto Comando ${Date.now()}` }).then((produto) => {
      cy.loginViaApi()
      cy.visit('/admin/listarprodutos')
      cy.contains('td', produto.nome).should('be.visible')
    })
  })
})

describe('Massa realista com faker', () => {
  it('deve cadastrar usuário com dados gerados', () => {
    const usuario = {
      nome: faker.person.fullName(),
      // Faker gera dado REALISTA, não ÚNICO. O Date.now() garante a unicidade.
      email: `${faker.internet.username().toLowerCase()}_${Date.now()}@qa.com`,
      password: faker.internet.password({ length: 10 }),
      administrador: 'false'
    }

    cy.criarUsuarioViaApi(usuario).then((criado) => {
      cy.request('GET', `${Cypress.env('apiUrl')}/usuarios/${criado._id}`)
        .its('body.nome')
        .should('eq', usuario.nome)
    })
  })
})
