// Bloco 3.2 — um único arquivo com os seletores.
// Se o data-testid do botão entrar mudar, quantos arquivos você abre? Um.

export const login = {
  email: '[data-testid="email"]',
  senha: '[data-testid="senha"]',
  entrar: '[data-testid="entrar"]',
  alerta: '.alert'
}

// Atenção: no cadastro o campo de senha é "password", não "senha".
export const cadastroUsuario = {
  nome: '[data-testid="nome"]',
  email: '[data-testid="email"]',
  password: '[data-testid="password"]',
  checkboxAdmin: '[data-testid="checkbox"]',
  cadastrar: '[data-testid="cadastrar"]',
  alerta: '.alert'
}

export const cadastroProduto = {
  nome: '[data-testid="nome"]',
  preco: '[data-testid="preco"]',
  descricao: '[data-testid="descricao"]',
  quantidade: '[data-testid="quantity"]',
  // Sim, falta um "r". O erro de digitação é da aplicação.
  cadastrar: '[data-testid="cadastarProdutos"]'
}

// As tabelas do admin não têm data-testid: é o "quando não há escolha" do bloco 1.7.
export const listagem = {
  tabela: 'table.table-striped',
  linhas: 'table.table-striped tbody tr'
}
