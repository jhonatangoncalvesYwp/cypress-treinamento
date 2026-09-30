# Login SAML 2.0 no Cypress — exemplo

As configurações do Cypress para testar uma aplicação com login de empresa
(SSO por SAML 2.0). O exemplo roda de verdade contra um provedor de identidade
(IdP) de teste e uma aplicação que exige login por ele, os dois em Docker, no
repositório `serverest-treinamento`.

| Arquivo | O que é | No seu projeto vai em |
|---|---|---|
| `cypress.config.js` | Endereço da aplicação e do IdP | `cypress.config.js` |
| `login-saml.js` | Comando `cy.loginSaml()` com `cy.session` + `cy.origin` | `cypress/support/commands.js` |
| `area-logada.cy.js` | Dois testes usando o comando | `cypress/e2e/` |

## Rodar

1. Abra o Docker Desktop. Na pasta `serverest-treinamento` (faça `git pull`
   antes, se ela é da primeira aula):

   ```bash
   npm run saml:subir
   ```

2. Nesta pasta do treinamento, com usuário e senha em variáveis de ambiente:

   ```powershell
   # PowerShell (Windows)
   $env:CYPRESS_samlUsuario = 'user1'
   $env:CYPRESS_samlSenha = 'user1pass'
   npx cypress run --config-file exemplos/saml-2.0/cypress.config.js
   ```

   ```bash
   # Mac e Linux
   export CYPRESS_samlUsuario='user1'
   export CYPRESS_samlSenha='user1pass'
   npx cypress run --config-file exemplos/saml-2.0/cypress.config.js
   ```

3. No fim, `npm run saml:parar` na pasta `serverest-treinamento`.

Dois testes verdes. O segundo leva menos de meio segundo, porque não passa
pelo IdP: o `cy.session` restaura a sessão do primeiro.

## As peças

1. **`cy.origin`**: a tela de login é de outro domínio, o do IdP. Os comandos
   que mexem nela ficam dentro do `cy.origin`, e ele só enxerga o que recebe
   em `args`.
2. **`cy.session`**: faz o login uma vez e reaproveita a sessão, inclusive
   entre arquivos (`cacheAcrossSpecs`). O `validate` confere se a sessão ainda
   vale; se não valer, o login é refeito. É o princípio do login via API do
   Dia 2: setup pela via mais rápida.
3. **Credenciais fora do código**: `CYPRESS_samlUsuario` e `CYPRESS_samlSenha`.
   A senha é digitada com `{ log: false }`, para não aparecer no log nem nos
   vídeos. No Jenkins, as duas vêm de uma credencial cadastrada nele.
4. **`experimentalModifyObstructiveThirdPartyCode`**: desligada no exemplo.
   Ligue só se a tela de login da sua empresa não abrir dentro do Cypress
   (Entra ID/Azure AD, ADFS e Okta costumam precisar).

## Duas armadilhas encontradas montando este exemplo

**A aplicação que redireciona direto para o IdP.** Se abrir a aplicação já
leva à tela de login do IdP, o `cy.visit` segue o redirecionamento e, para o
Cypress, o IdP vira a página principal do teste. Aí é a volta para a
aplicação que passa a exigir `cy.origin`, e o erro é:

```
The command was expected to run against origin `http://127.0.0.1:8180`
but the application is at origin `http://localhost:4000`.
```

Por isso o comando começa numa página da própria aplicação (`/login`, com o
botão "Entrar com SSO"). Se o seu sistema não tem uma página assim, peça uma
ao time.

**O botão pelo texto.** O IdP traduz a tela pelo idioma do navegador: o botão
"Login" apareceu como "Acessar" dentro do Cypress. É a camada 4 do Bloco 1.7,
texto visível é sensível a tradução. O comando usa `form[name="f"] button`.

## Antes de fazer na sua empresa, combine com o time

- **Usuário de teste sem MFA**, num ambiente de teste. Código de SMS, push no
  celular ou token não dá para automatizar pela tela
- Se o time topar, um **atalho só no ambiente de teste** (login por API, ou um
  token de teste) é mais rápido e estável que passar pelo IdP. Pela tela, o
  SAML depende de um sistema de terceiros que o seu teste não controla
