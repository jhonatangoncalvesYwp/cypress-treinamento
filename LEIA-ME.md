# Treinamento Cypress — projeto completo

O projeto construído nos três dias de aula, no estado final, com todos os
exercícios resolvidos, mais as apostilas e os slides em PDF.

## Material

| Pasta | Conteúdo |
|---|---|
| `material/apostila/` | Apostila do aluno, um PDF por dia |
| `material/slides/` | Slides das aulas, um PDF por dia |

## Exercícios e onde está a resolução

| Bloco | Exercício | Resolução |
|---|---|---|
| 1.2 | Leitura de código | Apostila do Dia 1, logo depois do enunciado |
| 1.3 | Alterar o viewport | `cypress.config.js` (voltou para 1280) |
| 1.4 | Login com senha inválida | `cypress/e2e/dia1/01-primeiro-teste.cy.js` |
| 1.5 | Suíte de cadastro, três cenários | `cypress/e2e/dia1/exercicio-cadastro.cy.js` |
| 1.6 | Refatoração com `beforeEach` | `cypress/e2e/dia1/03-hooks.cy.js` |
| 1.7 | Diagnóstico de teste quebrado | `cypress/e2e/dia1/04-debugging.cy.js` (já corrigido) |
| **1.8** | **Lab do Dia 1** | `cypress/e2e/dia1/lab-dia1.cy.js` |
| 2.2 | Login com alias | `cypress/e2e/dia2/05-alias.cy.js` |
| 2.3 | Criar, consultar e excluir pela API | `cypress/e2e/dia2/06-api-usuarios.cy.js` |
| 2.5 | Fixture de produtos em loop | `cypress/e2e/dia2/09-data-driven.cy.js` |
| 2.6 | Comando `cadastrarProdutoViaApi` | `cypress/support/api-commands.js`; respostas na apostila do Dia 2 |
| **2.8** | **Lab do Dia 2** | `cypress/e2e/dia2/lab-dia2.cy.js` |
| 3.2 | Refatoração para Page Object | `cypress/pages/` e `cypress/e2e/dia3/11-page-objects.cy.js` |
| **3.8** | **Lab final** | `cypress/e2e/dia3/lab-final.cy.js` |
| 3.8 | Code review | O arquivo errado de propósito é `cypress/e2e/dia3/codigo-para-revisar.js`; o gabarito e a versão corrigida estão em `cypress/e2e/dia3/codigo-revisado.cy.js` |

## Extra: login SAML 2.0

Pergunta da turma. Em `exemplos/saml-2.0/`: as configurações do Cypress para
uma aplicação com login SAML (`cy.origin` + `cy.session`). Roda contra um
provedor de identidade de teste em Docker, que sobe pelo repositório
`serverest-treinamento` (`npm run saml:subir`). O passo a passo está no
`LEIA-ME.md` da pasta.

## Como rodar

1. Suba a loja e a API na sua máquina, pelo repositório
   [serverest-treinamento](https://github.com/jhonatangoncalvesYwp/serverest-treinamento)
   (`npm start`; o README dele tem o passo a passo). Loja em
   `http://localhost:3001`, API em `http://localhost:3000`
2. Nesta pasta: `npm install`
3. `npx cypress open` para a janela, ou `npx cypress run` para rodar tudo

Os testes de banco de dados (`cypress/e2e/dia3/banco/`) precisam do
PostgreSQL do Bloco 3.7 no ar. Sem ele, rode o resto assim:

```
npx cypress run --spec "cypress/e2e/dia1/**/*.cy.js,cypress/e2e/dia2/**/*.cy.js,cypress/e2e/dia3/*.cy.js,cypress/e2e/dia3/cucumber/*.feature"
```

> No terminal do VS Code, se o Cypress falhar com `bad option: --smoke-test`,
> rode antes `Remove-Item Env:ELECTRON_RUN_AS_NODE` (PowerShell) ou
> `unset ELECTRON_RUN_AS_NODE` (Mac e Linux).
