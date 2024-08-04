const express = require("express");
const app = express();
const path = require("path");
var cors = require("cors");

const rootPath = "./"
require('dotenv').config({path : path.join(rootPath,".env")});
const router = require('./src/routes/routes.js');


app.use(cors());
app.use(express.json());
app.use(router);




const port = process.env.PORT || 4000;



app.listen(port, () =>
  console.log("listening on port " + port + " ")
);
