const express = require("express");
const app = express();
const rootPath = "../../"
require('dotenv').config({path : rootPath + ".env"});


const port = process.env.port || 3000;

app.listen(port, () =>
  console.log("listening on port " + port + " ")
);
