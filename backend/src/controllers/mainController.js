
const express = require('express');
const oracle = require('./oracletest');

async function testOracle(req, res) {
   try {
      const result = await oracle.testOracleConnection();
      if (result) {
         return res.send("success");
      } else {
         return
      }
   } catch (error) {
      console.log(error);
      return res.status(400).send("failure");
   }
}

async function executeSQL(req, res) {
   try {
      await oracle.withOracleDB(async (connection) => {
         console.log(req.body);
         const result = await connection.execute(req.body.string);
         await connection.commit();
         res.json(result);
      });
   } catch (e) {
      console.log(e);
      res.status(400).send(e.error);
   }
}


async function checkUserHasAccessToRepo(req, res) {
   const username = req.body.username;
   const password = req.body.password;
   const repoName = req.body.repoName;
   try {
      await oracle.withOracleDB(async (connection) => {
       console.log(username,password,repoName);
       const result = await connection.execute(` 
       SELECT Count(*)
       FROM Users2 u2, UserContributesTo uc, Repo r, Permissions p, Users1 u1
       WHERE u2.id = uc.userid
       AND u2.email = u1.email
       AND r.id = uc.repoid
       AND p.permissions = uc.permissions
       AND (p.READWRITE = 'READ' OR p.READWRITE = 'WRITE')
       AND u2.username = :username
       AND u1.hashPassword = :password
       AND r.name = :repoName
      `,{username: username, password:password, repoName: repoName});
      console.log(result);
      res.json({validLogin: result.rows[0][0]});
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
}

async function checkLogin(req, res) {
   try {
      const username = req.body.username;
      const password = req.body.password;

      console.log(username, password);

      if (username === null || password === null) {
         res.status(400).send("empty username or password");
      }

      await oracle.withOracleDB(async (connection) => {
         const result = await connection.execute(`
            SELECT Count(*)
            FROM Users1 u1
            WHERE u1.email IN (SELECT email FROM Users2 u2 WHERE u2.username =  :username)
            AND u1.hashPassword = :password `, { username: username, password: password });
           
           res.json({validLogin: result.rows[0][0]});
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
}


async function addUserToDB(req, res) {
   try {
      const username = req.body.username;
      const password = req.body.password;
      const email = req.body.email;

      console.log(username, password, email);

      if (username === null || password === null || email === null) {
         res.status(400).send("empty username, password or email");
      }

      await oracle.withOracleDB(async (connection) => {
         const result = await connection.execute(`
      DECLARE
        var_count INTEGER;
        var_date DATE;
      BEGIN
        SELECT CURRENT_DATE INTO var_date FROM DUAL;
        SELECT COUNT(email) + 1 INTO var_count FROM Users1;
        INSERT INTO Users1(email, hashPassword) VALUES (:email, :password);
        INSERT INTO Users2(id, username, dateJoined, email) 
        VALUES (var_count, :username, TO_DATE(var_date, 'yyyy/mm/dd'), :email);
        COMMIT;
      END;
            `, { username: username, password:password, email: email});

            console.log(result);
            res.json({ validLogin: true });
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
}


async function addUserToRepo(req, res) {
   try {
      const repoName = req.body.repoName;
      const username = req.body.username;

      console.log(repoName, username);

      if (!repoName || !username) {
         res.status(400).send("repo empty");
      }

      await oracle.withOracleDB(async (connection) => {
         const result = await connection.execute(`
      DECLARE
        var_date DATE;
        var_repoID INTEGER;
        var_branchID INTEGER;
        var_commitID INTEGER;
        var_userID INTEGER;
        var_folderID INTEGER;
      BEGIN
        SELECT id INTO var_userID FROM Users2 WHERE username = :username;
        SELECT CURRENT_DATE INTO var_date FROM DUAL;
        SELECT COUNT(id) + 1 INTO var_repoID FROM Repo;
        SELECT COUNT(id) + 1 INTO var_commitID FROM Commits;
        SELECT COUNT(id) + 1 INTO var_folderID FROM Folders;
        INSERT INTO Repo(id, name, dateCreated) 
        VALUES (var_repoID, :repoName, TO_DATE(var_date, 'yyyy/mm/dd'));
        INSERT INTO Branch(repoid, name, createdOn)
        VALUES (var_repoID, 'main', TO_DATE(var_date, 'yyyy/mm/dd'));
        INSERT INTO Commits (id, dateCreated, message, repoid, branchname, creatorUserID)
        VALUES (var_commitID, TO_DATE(var_date, 'yyyy/mm/dd'), 'initial commit', var_repoID, 'main', var_userID);
        INSERT INTO CommitsAndFolders (folderId, commitId)
        VALUES (var_folderID, var_commitID);
        INSERT INTO UserContributesTo(userid,repoid, permissions) VALUES (var_userID, var_repoID, 2);
        COMMIT;
      END;
            `, {repoName: repoName, username: username});

            console.log(result);
            res.json({createdSuccess: true});
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
}


module.exports = { checkLogin, testOracle, executeSQL, addUserToDB, checkUserHasAccessToRepo, addUserToRepo};