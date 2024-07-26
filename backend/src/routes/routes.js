const express = require("express");
const router = express.Router();

const {testFunction} = require("../controllers/mainController");

router.get("/helloworld",(req,res) => {console.log("hello world")});
router.get("/test", testFunction);

module.exports = router;