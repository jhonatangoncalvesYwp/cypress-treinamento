// Bloco 3.7 — Banco de dados com cy.task

import CadastroUsuarioPage from '../../../pages/CadastroUsuarioPage'

describe('PostgreSQL — a conexão pelo cy.task', () => {
  it('deve consultar o banco de dados', () => {
    cy.task('sql', { comando: 'SELECT current_database() AS banco' })
      .its('0.banco')
      .should('eq', 'treinamento')
  })

  it('deve gravar e ler um cliente', () => {
    const email = `cliente_${Date.now()}@qa.com`

    cy.task('sql', {
      comando: 'INSERT INTO clientes (nome, email) VALUES ($1, $2) RETURNING id',
      valores: ['Cliente do Banco', email]
    }).then(([cliente]) => {
      cy.task('sql', {
        comando: 'SELECT nome, email FROM clientes WHERE id = $1',
        valores: [cliente.id]
      })
        .its(0)
        .should('deep.equal', { nome: 'Cliente do Banco', email })
    })
  })

  it('deve apagar o cliente criado pelo teste', () => {
    cy.task('sql', {
      comando: 'INSERT INTO clientes (nome, email) VALUES ($1, $2) RETURNING id',
      valores: ['Cliente a Apagar', `apagar_${Date.now()}@qa.com`]
    }).then(([cliente]) => {
      cy.task('sql', { comando: 'DELETE FROM clientes WHERE id = $1', valores: [cliente.id] })

      cy.task('sql', { comando: 'SELECT id FROM clientes WHERE id = $1', valores: [cliente.id] })
        .should('be.empty')
    })
  })
})

describe('O banco da própria loja', () => {
  it('deve gravar no banco o usuário cadastrado pela interface', () => {
    const usuario = { nome: 'Cliente pela Tela', email: `tela_${Date.now()}@qa.com`, password: 'teste123' }

    CadastroUsuarioPage.cadastrar(usuario, { administrador: true }).validarMensagem('Cadastro realizado com sucesso')

    // A tela disse "sucesso". O banco diz o que foi gravado de fato.
    cy.task('buscarUsuarioNoBancoDaLoja', usuario.email).should('include', {
      nome: usuario.nome,
      administrador: 'true'
    })
  })
})
