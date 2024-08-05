const express = require("express");
const router = express.Router();

const {checkLogin,testOracle,executeSQL, addUserToDB, checkUserHasAccessToRepo, createRepo, getRepos} = require("../controllers/mainController");
<<<<<<< HEAD
const {getFileContents, getFilesAndFolders, getRootFolderID, createFile, createFolder} = require("../controllers/fileController");
const {testReactConnection} = require("../controllers/reactController");
=======
const {getFileContents, getFilesAndFolders, getRootFolderID} = require("../controllers/fileController");
const {testReactConnection, divisionGet, divisionPost, projectionPost, query_AggNest, query_AggHav, query_AggNorm} = require("../controllers/userListControllers");
>>>>>>> 4b3155a783aea4d7e1b619193490ee6ea88f18c1


router.get("/api", testReactConnection);

router.get("/testConnection", testOracle);
<<<<<<< HEAD
router.post("/apipost", (req, res) => {
  console.log('post recieved');
  console.log(req.body);
  res.send(201);
});

=======
>>>>>>> 4b3155a783aea4d7e1b619193490ee6ea88f18c1
router.post("/testSQL", executeSQL);
router.post("/login",checkLogin);
router.post("/signup", addUserToDB);
router.post("/hasAccess", checkUserHasAccessToRepo);
router.post("/GetContent", getFileContents);
router.post("/createRepo", createRepo);
router.post("/getRepos", getRepos);
router.post("/getFilesAndFolders", getFilesAndFolders);
router.post("/getRootFolderID", getRootFolderID);
<<<<<<< HEAD
router.post("/createFolder", createFolder);
router.post("/createFile", createFile);
=======
// router.post("/createFile", createFile);
router.post("/getIssues", getIssues);


router.post("/projection", projectionPost);
router.post("/AggNest", query_AggNest);
router.post("/AggHav", query_AggHav);
router.post("/AggNorm", query_AggNorm);
router.get("/divisionGet", divisionGet);
router.post("/divisionPost", divisionPost);

>>>>>>> 4b3155a783aea4d7e1b619193490ee6ea88f18c1


module.exports = router;