const express = require("express");
const cors = require("cors");
const app = express();
const rotareceber = require("./router/receber");
const rotaenviar = require("./router/enviar");
const port = 3030;

app.use(cors());
app.use(express.json());
app.use("/", rotareceber);
app.use("/", rotaenviar);

app.listen(port, () => {
  console.log("Server is running");
});
