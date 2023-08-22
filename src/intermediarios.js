const { contas, banco } = require("./bancodedados");
const { encontrarConta } = require("./controladores/contas");

const acessoAsContas = (req, res, next) => {
  const { senha_banco } = req.query;

  if (!senha_banco) {
    return res.status(401).json({ mensagem: "A senha é obrigatória" });
  } else if (senha_banco !== banco.senha) {
    return res.status(401).json({ mensagem: "A senha é inválida" });
  }
  next();
};

const acessoAoSaldoEExtrato = (req, res, next) => {
  const { numero_conta, senha } = req.query;

  if (!numero_conta || !senha) {
    return res
      .status(401)
      .json({ mensagem: "Número da conta e senha são obrigatórios." });
  }

  const contaEncontrada = encontrarConta(contas, numero_conta);

  if (!contaEncontrada) {
    return res.status(401).json({ mensagem: "Conta bancária não encontrada" });
  }

  if (senha !== contaEncontrada.usuario.senha) {
    return res.status(401).json({ mensagem: "Senha inválida!" });
  }

  next();
};

module.exports = {
  acessoAsContas,
  acessoAoSaldoEExtrato,
};
