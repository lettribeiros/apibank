const {
  contas,
  saques,
  depositos,
  transferencias,
} = require("../bancodedados");
let { numero } = require("../bancodedados");

const validarEmailECpf = (listaDeContas, email, cpf) => {
  return listaDeContas.some((conta) => {
    return conta.usuario.cpf === cpf || conta.usuario.email === email;
  });
};

const encontrarConta = (listaDeContas, numeroDaConta) => {
  const contaEncontrada = listaDeContas.find((conta) => {
    return conta.numero === Number(numeroDaConta);
  });

  return contaEncontrada;
};

const criarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res
      .status(404)
      .json({ mensagem: "Todos os campos são obrigatórios" });
  }

  const dadosInvalidos = validarEmailECpf(contas, email, cpf);

  if (dadosInvalidos) {
    return res
      .status(404)
      .json({ mensagem: "Já existe uma conta com cpf ou email informado" });
  }

  const conta = {
    numero: numero++,
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha,
    },
  };

  contas.push(conta);

  return res.status(201).json();
};

const listarContas = (req, res) => {
  return res.status(200).json(contas);
};

const atualizarUsuario = (req, res) => {
  const { numeroConta } = req.params;

  if (!numeroConta) {
    return res
      .status(404)
      .json({ mensagem: "O numero da conta é obrigatório" });
  }

  const contaEncontrada = encontrarConta(contas, numeroConta);

  if (!contaEncontrada) {
    return res.status(404).json({ mensagem: "A conta informada não existe" });
  }

  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res
      .status(404)
      .json({ mensagem: "Todos os campos são obrigatórios" });
  }

  const dadosInvalidos = validarEmailECpf(contas, email, cpf);

  if (cpf === contaEncontrada.usuario.cpf) {
  } else if (email === contaEncontrada.usuario.email) {
  } else if (dadosInvalidos) {
    return res
      .status(404)
      .json({ mensagem: "Já existe uma conta com cpf ou email informado" });
  }

  (contaEncontrada.usuario.nome = nome),
    (contaEncontrada.usuario.cpf = cpf),
    (contaEncontrada.usuario.data_nascimento = data_nascimento),
    (contaEncontrada.usuario.telefone = telefone),
    (contaEncontrada.usuario.email = email),
    (contaEncontrada.usuario.senha = senha);

  return res.status(204).json();
};

const excluirUsuario = (req, res) => {
  const { numeroConta } = req.params;

  if (!numeroConta) {
    return res
      .status(404)
      .json({ mensagem: "O numero da conta é obrigatório" });
  }

  const contaEncontrada = encontrarConta(contas, numeroConta);

  if (!contaEncontrada) {
    return res.status(404).json({ mensagem: "A conta informada não existe" });
  }

  if (contaEncontrada.saldo > 0) {
    return res
      .status(404)
      .json({ mensagem: "A conta só pode ser removida se o saldo for zero." });
  }

  const indiceUsuario = contas.indexOf(contaEncontrada);

  contas.splice(indiceUsuario, 1);

  return res.status(204).json();
};

const saldo = (req, res) => {
  const { numero_conta } = req.query;

  const contaEncontrada = encontrarConta(contas, numero_conta);

  const saldos = {
    saldo: contaEncontrada.saldo,
  };

  return res.json(saldos);
};

const extrato = (req, res) => {
  const { numero_conta } = req.query;

  const contaEncontrada = encontrarConta(contas, numero_conta);

  const deposito = depositos.filter((deposito) => {
    return deposito.numero_conta === contaEncontrada.numero;
  });

  const saque = saques.filter((saque) => {
    return saque.numero_conta === contaEncontrada.numero;
  });

  const transfEnvidada = transferencias.filter((transf) => {
    return Number(transf.numero_conta_origem) === contaEncontrada.numero;
  });

  const transfRecebida = transferencias.filter((transf) => {
    return Number(transf.numero_conta_destino) === contaEncontrada.numero;
  });

  const extrato = {
    depositos: deposito,
    saques: saque,
    transferenciasEnviadas: transfEnvidada,
    transferenciasRecebidas: transfRecebida,
  };

  return res.status(200).json(extrato);
};

module.exports = {
  criarConta,
  listarContas,
  atualizarUsuario,
  excluirUsuario,
  encontrarConta,
  saldo,
  extrato,
};
