const express = require("express");
const router = express.Router();

const {checkLogin,testOracle,executeSQL, addUserToDB, checkUserHasAccessToRepo, createRepo, getRepos} = require("../controllers/mainController");
const {getFileContents, getFilesAndFolders, getRootFolderID, createFile} = require("../controllers/fileController");
const {testReactConnection} = require("../controllers/reactController");



router.get("/api", testReactConnection)
router.get("/testConnection", testOracle);
router.post("/apipost", (req, res) => {
  console.log('post recieved');
  console.log(req.body);
  res.send(201);
});
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