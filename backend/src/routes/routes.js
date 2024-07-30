const express = require("express");
const router = express.Router();

const {checkLogin,testOracle,testFunction,executeSQL} = require("../controllers/mainController");

router.get("/test", testFunction);
router.get("/testConnection", testOracle);
router.post("/testSQL", executeSQL);
router.post("/login",checkLogin);


module.exports = router;