# language: pt

Funcionalidade: Login na loja
  Como administrador da loja
  Quero entrar no sistema
  Para administrar produtos e usuários

  Cenário: Login com credenciais válidas
    Dado que estou na página de login
    Quando informo o e-mail "admin.treinamento@qa.com" e a senha "treino123"
    E clico no botão entrar
    Então devo visualizar a home do administrador

  Cenário: Login com senha inválida
    Dado que estou na página de login
    Quando informo o e-mail "admin.treinamento@qa.com" e a senha "senhaerrada"
    E clico no botão entrar
    Então devo ver a mensagem "Email e/ou senha inválidos"

  Esquema do Cenário: Login inválido em diferentes situações
    Dado que estou na página de login
    Quando informo o e-mail "<email>" e a senha "<senha>"
    E clico no botão entrar
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | email                    | senha      | mensagem                   |
      | naoexiste@qa.com         | teste      | Email e/ou senha inválidos |
      | admin.treinamento@qa.com | outrasenha | Email e/ou senha inválidos |
