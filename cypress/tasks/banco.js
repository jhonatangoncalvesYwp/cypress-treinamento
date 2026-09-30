// Bloco 3.7 — as tarefas que falam com banco de dados.
//
// Este arquivo roda no Node, não no navegador. O teste roda no navegador, e o
// navegador não abre conexão com banco. O cy.task é a ponte: o teste pede
// pelo nome, o Node executa aqui, e a resposta volta para o teste.

const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')

// As credenciais vêm de variável de ambiente. O valor depois do || é o banco
// de estudo desta demonstração (Docker, porta 5433); no trabalho, só a variável.
const pool = new Pool({
  // 127.0.0.1 e não localhost: com o banco fora do ar, localhost dava só
  // "AggregateError"; assim o erro diz "ECONNREFUSED 127.0.0.1:5433".
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 5433),
  database: process.env.DB_NAME || 'treinamento',
  user: process.env.DB_USER || 'treinamento',
  password: process.env.DB_PASSWORD || 'treino123'
})

// O banco da loja fica dentro da instalação do ServeRest, na pasta ao lado.
const DADOS_DA_LOJA =
  process.env.SERVEREST_DADOS ||
  path.resolve(__dirname, '../../../serverest-treinamento/node_modules/serverest/src/data')

module.exports = {
  // O SQL e os valores vão separados: o pg encaixa cada valor no $1, $2...
  // com segurança. Montar o SQL com ${} no texto abre a porta para SQL injection.
  async sql({ comando, valores = [] }) {
    const { rows } = await pool.query(comando, valores)
    return rows
  },

  // Para dado que a aplicação grava com atraso (fila, processo em segundo
  // plano). O should não repete o cy.task: a consulta roda uma vez só. Então a
  // espera fica aqui, no Node: consulta de meio em meio segundo até achar
  // alguma linha, ou falha com mensagem clara quando o prazo acaba.
  async esperarNoBanco({ comando, valores = [], segundos = 10 }) {
    const limite = Date.now() + segundos * 1000
    for (;;) {
      const { rows } = await pool.query(comando, valores)
      if (rows.length) return rows
      if (Date.now() > limite) throw new Error(`Nada no banco depois de ${segundos} s: ${comando}`)
      await new Promise((ok) => setTimeout(ok, 500))
    }
  },

  // O ServeRest usa o NeDB: um arquivo de texto, um registro JSON por linha.
  // Só leitura, e sem o driver do NeDB: ele reescreve o arquivo ao abrir, e
  // disputaria o arquivo com a loja no ar.
  buscarUsuarioNoBancoDaLoja(email) {
    const linhas = fs
      .readFileSync(path.join(DADOS_DA_LOJA, 'usuarios.db'), 'utf8')
      .split('\n')
      .filter(Boolean)

    // O NeDB nunca altera uma linha, só acrescenta: vale a última de cada _id.
    const usuarios = new Map()
    for (const linha of linhas) {
      const registro = JSON.parse(linha)
      if (!registro._id) continue
      if (registro.$$deleted) usuarios.delete(registro._id)
      else usuarios.set(registro._id, registro)
    }

    // Uma task não pode devolver undefined: o cy.task falharia. null pode.
    return [...usuarios.values()].find((usuario) => usuario.email === email) || null
  }
}
