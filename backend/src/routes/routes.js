const express = require("express");
const router = express.Router();

const {checkLogin,testOracle,executeSQL, addUserToDB, checkUserHasAccessToRepo, addUserToRepo, getRepos} = require("../controllers/mainController");
const {getFileContents} = require("../controllers/fileController");

router.get("/testConnection", testOracle);
router.post("/testSQL", executeSQL);
router.post("/login",checkLogin);
router.post("/signup", addUserToDB);
router.post("/hasAccess", checkUserHasAccessToRepo);
router.post("/GetContent", getFileContents);
router.post("/createRepo", addUserToRepo);
router.post("/getRepos", getRepos);

module.exports = router;