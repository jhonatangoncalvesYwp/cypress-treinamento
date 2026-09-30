// Bloco 3.8 — Código para revisar
//
// Este arquivo está errado DE PROPÓSITO, e não faz parte da suíte (não
// termina em .cy.js). Leia com o checklist de code review na mão.
// Há pelo menos dez problemas.

describe('Produtos', () => {
  it('teste 1', () => {
    cy.visit('/login')
    cy.get('.form-control').eq(0).type('admin.treinamento@qa.com')
    cy.get('.form-control').eq(1).type('treino123')
    cy.get('.btn-primary').click()
    cy.wait(3000)

    cy.visit('/admin/cadastrarprodutos')
    cy.get('[data-testid="nome"]').type('Mouse Gamer')
    cy.get('[data-testid="preco"]').type('150')
    cy.get('[data-testid="descricao"]').type('Mouse com RGB')
    cy.get('[data-testid="quantity"]').type('10')
    cy.get('[data-testid="cadastarProdutos"]').click()
  })

  it('teste 2', () => {
    cy.visit('/login')
    cy.get('.form-control').eq(0).type('admin.treinamento@qa.com')
    cy.get('.form-control').eq(1).type('treino123')
    cy.get('.btn-primary').click()
    cy.wait(3000)

    cy.visit('/admin/listarprodutos')
    cy.get('body').then(($body) => {
      if ($body.text().includes('Mouse Gamer')) {
        cy.log('produto cadastrado')
      }
    })
  })

  it('teste 3', () => {
    cy.request({
      method: 'DELETE',
      url: 'http://localhost:3000/produtos/k9Xq3LmP0aZ7wR2t',
      headers: { authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmlhQGVtcHJlc2EuY29tIn0' }
    })
  })

  // it('deve editar o produto', () => {
  //   falhando desde a semana passada, depois eu vejo
  // })
})
