const express = require("express");
const cors = require("cors");
const app = express();
const rotareceber = require("./router/receber");
const port = 3030;

app.use(cors());
app.use(express.json());
app.use("/", rotareceber);

app.listen(port, () => {
  console.log("Server is running");
});
