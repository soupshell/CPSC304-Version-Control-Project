const express = require("express");
const router = express.Router();

const {testOracle,testFunction,executeSQL} = require("../controllers/mainController");

router.get("/test", testFunction);
router.get("/testConnection", testOracle);
router.post("/testSQL", executeSQL);


module.exports = router;