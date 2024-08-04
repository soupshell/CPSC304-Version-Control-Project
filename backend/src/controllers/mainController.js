
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


async function createRepo(req, res) {
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
        SELECT MAX(id) + 1 INTO var_repoID FROM Repo;
        SELECT MAX(id) + 1 INTO var_commitID FROM Commits;
        SELECT MAX(id) + 1 INTO var_folderID FROM Files;
        INSERT INTO Repo(id, name, dateCreated) 
        VALUES (var_repoID, :repoName, TO_DATE(var_date, 'yyyy/mm/dd'));
        INSERT INTO Branch(repoid, name, createdOn)
        VALUES (var_repoID, 'main', TO_DATE(var_date, 'yyyy/mm/dd'));
        INSERT INTO Commits (id, dateCreated, message, repoid, branchname, creatorUserID)
        VALUES (var_commitID, TO_DATE(var_date, 'yyyy/mm/dd'), 'initial commit', var_repoID, 'main', var_userID);
        INSERT INTO Files(id, path, createdOn, blobHash) 
        VALUES  (var_folderID, '/', var_date, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
	     INSERT INTO Folders(id, numberOfFiles) 
        VALUES (var_folderID, 0);
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



async function getRepos(req, res) {
   try {
      const username = req.body.username;
      const password = req.body.password;

      console.log(username, password);

      if (!username || !password) {
         res.status(400).send("something went wrong");
      }
     

      // feel free to make this better lol
      await oracle.withOracleDB(async (connection) => {
         // u1 is owner, u2 is current user
         const result = await connection.execute(`
SELECT DISTINCT r.id, r.name, u1.username, p2.readWrite, b.name, c.dateCreated
      from Users2 u1, UserContributesTo u_r, Repo r, Users2 u2, Permissions p, UserContributesTo u_r2, 
      Permissions p2, Branch b, Commits c
      where u_r.userid = u1.id
      and u_r.repoid = r.id
      and u_r.userid = u1.id
      and p.permissions = u_r.permissions
      and p.isOwner = 1
      and u_r2.userid = u2.id
      and u_r2.repoid = r.id
      and p2.permissions = u_r2.permissions
      and b.repoid = r.id
      and c.repoid = r.id
      and c.branchname = b.name
      and c.dateCreated IN (SELECT max(dateCreated) 
                            FROM (Select *
                            From commits
                            WHERE repoid = r.id
                           ))
      and u2.username =  :username
 `, {username: username});

            console.log(result);
            res.json({queryResult: result});
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
}


module.exports = { checkLogin, testOracle, executeSQL, addUserToDB, checkUserHasAccessToRepo, createRepo, getRepos};