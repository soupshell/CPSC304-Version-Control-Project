const express = require("express");
const router = express.Router();

const {checkLogin,testOracle,executeSQL, addUserToDB, checkUserHasAccessToRepo, createRepo, getRepos} = require("../controllers/mainController");
const {getFileContents, getFilesAndFolders, getRootFolderID} = require("../controllers/fileController");
const {testReactConnection, divisionGet, projectionPost} = require("../controllers/userListControllers");



router.get("/api", testReactConnection);
router.get("/divisionGet", divisionGet);

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

router.post("/projection", projectionPost);


module.exports = router;