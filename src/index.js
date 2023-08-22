const express = require("express");
const rotas = require("./roteador");

const app = express();

app.use(express.json());
app.use(rotas);

const porta = 3000;
app.listen(porta);
