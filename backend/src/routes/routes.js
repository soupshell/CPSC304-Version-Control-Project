const express = require("express");
const router = express.Router();

const {checkLogin,testOracle,executeSQL, addUserToDB, checkUserHasAccessToRepo, createRepo, getRepos, 
  getIssues, getAllContributors, addUserToRepo,
  getIssue, getComments, setResolved, deleteIssue, makeComment, makeIssue} = require("../controllers/mainController");
const {getFileContents, getFilesAndFolders, getRootFolderID, createFile, createFolder} = require("../controllers/fileController");
const {testReactConnection, divisionGet, divisionPost, projectionPost, query_AggNest, query_AggHav, query_AggNorm} = require("../controllers/userListControllers");


router.get("/api", testReactConnection);

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
router.post("/createFolder", createFolder);
router.post("/createFile", createFile);
router.post("/getIssues", getIssues);
router.post("/getContributors", getAllContributors);
router.post("/addUserToRepo", addUserToRepo);
router.post("/getIssue", getIssue);
router.post("/getComments", getComments);
router.post("/setResolved", setResolved);
router.post("/deleteIssue", deleteIssue);
router.post("/makeComment", makeComment);
router.post("/makeIssue", makeIssue);


router.post("/projection", projectionPost);
router.post("/AggNest", query_AggNest);
router.post("/AggHav", query_AggHav);
router.post("/AggNorm", query_AggNorm);
router.get("/divisionGet", divisionGet);
router.post("/divisionPost", divisionPost);



module.exports = router;