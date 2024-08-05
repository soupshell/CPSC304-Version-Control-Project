const express = require("express");
const router = express.Router();

const {checkLogin,testOracle,executeSQL, addUserToDB, checkUserHasAccessToRepo, createRepo, getRepos} = require("../controllers/mainController");
const {getFileContents, getFilesAndFolders, getRootFolderID, createFile} = require("../controllers/fileController");

router.get("/testConnection", testOracle);
router.post("/testSQL", executeSQL);
router.post("/login",checkLogin);
router.post("/signup", addUserToDB);
router.post("/hasAccess", checkUserHasAccessToRepo);
router.post("/GetContent", getFileContents);
router.post("/createRepo", createRepo);
router.post("/getRepos", getRepos);
router.post("/getFilesAndFolders", getFilesAndFolders);
router.post("/getRootFolderID", getRootFolderID);
router.post("/createFile", createFile);

module.exports = router;