const express = require("express");
const app = express();
const path = require("path");
const rootPath = "../../"
const router = require('./src/routes/routes.js');
require('dotenv').config({path : path.join(rootPath,".env")});


app.use(router);
const port = process.env.port || 3000;

app.listen(port, () =>
  console.log("listening on port " + port + " ")
);
