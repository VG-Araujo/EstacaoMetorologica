const express = require("express");
const Router = express.Router();
const axios = require("axios");
require("dotenv").config({ path: "./.env" });
const apikey = process.env.KEY;

Router.get("/busca/:cidade", async (req, res) => {
  try {
    const cidade = req.params.cidade;
    city = cidade;
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          appid: apikey,
          units: "metric",
          lang: "pt_br",
        },
      }
    );
    console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.log(process.env.KEY);
    console.log(error);
    res
      .status(500)
      .json({ msg: "Error ao receber dados da api", error: error });
  }
});

module.exports = Router;
