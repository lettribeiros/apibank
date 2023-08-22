const {
  contas,
  saques,
  depositos,
  transferencias,
} = require("../bancodedados");
const { format } = require("date-fns");
const { encontrarConta } = require("./contas");

const depositar = (req, res) => {
  const { numero_conta, valor } = req.body;

  if (!numero_conta || !valor) {
    return res
      .status(404)
      .json({ mensagem: "O número da conta e o valor são obrigatórios!" });
  }

  if (valor < 0 || valor === 0) {
    return res.status(404).json({ mensagem: "Valor inválido." });
  }

  const contaEncontrada = encontrarConta(contas, numero_conta);

  if (!contaEncontrada) {
    return res.status(404).json({ mensagem: "A conta informada não existe" });
  }

  contaEncontrada.saldo += valor;

  const date = new Date();
  const dataFormatada = format(date, "yyyy-MM-dd hh:mm:ss");

  const deposito = {
    data: dataFormatada,
    numero_conta,
    valor,
  };

  depositos.push(deposito);

  return res.status(204).json();
};

const sacar = (req, res) => {
  const { numero_conta, valor, senha } = req.body;

  if (!numero_conta || !valor || !senha) {
    return res.status(404).json({
      mensagem: "O número da conta, o valor e a senha são obrigatórios!",
    });
  }

  if (valor < 0 || valor === 0) {
    return res.status(404).json({ mensagem: "Valor inválido." });
  }

  const contaEncontrada = encontrarConta(contas, numero_conta);

  if (!contaEncontrada) {
    return res.status(404).json({ mensagem: "A conta informada não existe" });
  }

  if (senha !== contaEncontrada.usuario.senha) {
    return res.status(404).json({ mensagem: "Senha inválida" });
  }

  if (contaEncontrada.saldo < valor) {
    return res.status(404).json({ mensagem: "Saldo insuficiente!" });
  }

  contaEncontrada.saldo -= valor;

  const date = new Date();
  const dataFormatada = format(date, "yyyy-MM-dd hh:mm:ss");

  const saque = {
    data: dataFormatada,
    numero_conta,
    valor,
  };

  saques.push(saque);

  return res.status(204).json();
};

const transferir = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

  if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
    return res.status(404).json({
      mensagem:
        "Número da conta de origem e destino, valor e senha são obrigatórios!",
    });
  }

  if (valor < 0 || valor === 0) {
    return res.status(404).json({ mensagem: "Valor inválido." });
  }

  if (numero_conta_destino === numero_conta_origem) {
    return res.status(404).json({
      mensagem: "A transferência deve ser feita entre contas distintas",
    });
  }

  const contaEncontradaOrigem = encontrarConta(contas, numero_conta_origem);

  const contaEncontradaDestino = encontrarConta(contas, numero_conta_destino);

  if (!contaEncontradaOrigem) {
    return res.status(404).json({ mensagem: "Conta de origem não existe." });
  } else if (!contaEncontradaDestino) {
    return res.status(404).json({ mensagem: "Conta de destino não existe." });
  }

  if (senha !== contaEncontradaOrigem.usuario.senha) {
    return res.status(404).json({ mensagem: "Senha inválida" });
  }

  if (contaEncontradaOrigem.saldo < valor) {
    return res.status(404).json({ mensagem: "Saldo insuficiente!" });
  }

  contaEncontradaOrigem.saldo -= valor;
  contaEncontradaDestino.saldo += valor;

  const date = new Date();
  const dataFormatada = format(date, "yyyy-MM-dd hh:mm:ss");

  const transferencia = {
    data: dataFormatada,
    numero_conta_origem,
    numero_conta_destino,
    valor,
  };

  transferencias.push(transferencia);

  return res.status(204).json();
};

module.exports = {
  depositar,
  sacar,
  transferir,
};
