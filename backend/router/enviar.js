const express = require("express");
const Router = express.Router();

let DadosEsp = {
  temperatura: null,
  umidade: null,
  pressao: null,
};

Router.post("/dados/esp", async (req, res) => {
  try {
    const { temperatura, umidade, pressao } = await req.body;
    DadosEsp = { temperatura, umidade, pressao };
    res.status(200).json({ msg: "Dados postados com sucesso" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Error ao receber dados do esp", error: error });
  }
});

Router.get("/dados/esp", async (req, res) => {
  try {
    res.status(200).json(DadosEsp);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error ao pegar dados do esp", error: error });
  }
});

module.exports = Router;
