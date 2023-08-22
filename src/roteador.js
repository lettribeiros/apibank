const express = require("express");
const {
  criarConta,
  listarContas,
  atualizarUsuario,
  excluirUsuario,
  saldo,
  extrato,
} = require("./controladores/contas");
const { depositar, sacar, transferir } = require("./controladores/transacoes");
const { acessoAsContas, acessoAoSaldoEExtrato } = require("./intermediarios");
const rotas = express();

rotas.post("/contas", criarConta);
rotas.get("/contas", acessoAsContas, listarContas);
rotas.put("/contas/:numeroConta/usuario", atualizarUsuario);
rotas.delete("/contas/:numeroConta", excluirUsuario);
rotas.post("/transacoes/depositar", depositar);
rotas.post("/transacoes/sacar", sacar);
rotas.post("/transacoes/transferir", transferir);
rotas.get("/contas/saldo", acessoAoSaldoEExtrato, saldo);
rotas.get("/contas/extrato", acessoAoSaldoEExtrato, extrato);

module.exports = rotas;
