const express = require("express");
const router = express.Router();

const {checkLogin,testOracle,executeSQL, addUserToDB} = require("../controllers/mainController");

router.get("/testConnection", testOracle);
router.post("/testSQL", executeSQL);
router.post("/login",checkLogin);
router.post("/signup", addUserToDB);

module.exports = router;