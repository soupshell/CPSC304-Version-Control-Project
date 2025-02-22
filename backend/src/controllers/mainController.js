
const express = require('express');
const oracle = require('./oracletest');

async function testCredentialsRepo(connection, username, password, repoName){
   const hasAccess = await connection.execute(` 
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
     return hasAccess.rows[0][0];
}

async function testCredentialsRepoOwner(connection, username, password, repoName){
   const hasAccess = await connection.execute(` 
      SELECT Count(*)
      FROM Users2 u2, UserContributesTo uc, Repo r, Permissions p, Users1 u1
      WHERE u2.id = uc.userid
      AND u2.email = u1.email
      AND r.id = uc.repoid
      AND p.permissions = uc.permissions
      AND (p.READWRITE = 'READ' OR p.READWRITE = 'WRITE')
      AND p.isOwner = '1'
      AND u2.username = :username
      AND u1.hashPassword = :password
      AND r.name = :repoName
     `,{username: username, password:password, repoName: repoName});

     return hasAccess.rows[0][0];
}


async function testOracle(req, res) {
   try {
      const result = await oracle.testOracleConnection();
      if (result) {
         return res.status(200).send("success");
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
      return res.status(400).send(e.error);
   }
}

async function checkLogin(req, res) {
   try {
      const username = req.body.username;
      const password = req.body.password;

      console.log(username, password);

      if (username === null || password === null) {
         return  res.status(400).send("empty username or password");
      }

      await oracle.withOracleDB(async (connection) => {
         const result = await connection.execute(`
            SELECT Count(*)
            FROM Users1 u1
            WHERE u1.email IN (SELECT email FROM Users2 u2 WHERE u2.username =  :username)
            AND u1.hashPassword = :password `, { username: username, password: password });
           
         return res.json({validLogin: result.rows[0][0]});
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
         return res.status(400).send("empty username, password or email");
      }
      
      await oracle.withOracleDB(async (connection) => {


      const alreadyExists = await connection.execute(`
         SELECT Count(*)
         FROM  Users2 u2
         WHERE u2.email = :email 
         OR u2.username = :username
      `, { username: username, email: email});


      if(alreadyExists.rows[0][0]){
        return res.status(400).send("username or email already in taken");
      }


         const result = await connection.execute(`
      DECLARE
        var_count INTEGER;
        var_date DATE;
      BEGIN
        SELECT CURRENT_DATE INTO var_date FROM DUAL;
        SELECT COUNT(*) + 1 INTO var_count FROM Users2;
        INSERT INTO Users1(email, hashPassword) VALUES (:email, :password);
        INSERT INTO Users2(id, username, dateJoined, email) 
        VALUES (var_count, :username, var_date, :email);
        COMMIT;
      END;
            `, { username: username, password:password, email: email});

            console.log(result);
           return  res.json({ validLogin: true });
      });
   } catch (e) {
      return res.status(200).send(e.error);
   }
}


async function addUserToRepo(req, res) {
   try {
      const username = req.body.username;
      const password = req.body.password;
      const repoName = req.body.repoName;
      const otherUser = req.body.otherUser;
      const permissions = req.body.permissions;
      console.log(username, password, repoName, otherUser, permissions);

      if (username === null || password === null || repoName === null|| otherUser === null || permissions === null) {
        return res.status(400).send("empty username, password or email");
      }

      await oracle.withOracleDB(async (connection) => {
      const hasAccess = await testCredentialsRepoOwner(connection, username, password, repoName);
       if(!hasAccess){
             console.log(username, " is not an owner of the repo");
             return res.status(200).send("no access");
           }

       const result = await connection.execute(`
      DECLARE
        var_otherID INTEGER;
        var_repoID INTEGER;
        var_permissions INTEGER;
      BEGIN
        SELECT permissions INTO var_permissions FROM Permissions WHERE readWrite = :permissions AND isOwner = 0;
        SELECT id INTO var_otherID FROM Users2 WHERE Username = :otherUser;
        SELECT id INTO var_repoID FROM Repo WHERE name = :repoName;
        INSERT INTO UserContributesTo(userid,repoid, permissions) VALUES (var_otherID, var_repoID, var_permissions);
        COMMIT;
      END;
            `, { repoName: repoName, otherUser: otherUser, permissions: permissions});

            console.log(result);
            return res.json({ validLogin: true, queryResult : {}});
      });
   } catch (e) {
      console.log(e);
      return res.status(200).send(e.error);
   }
}


async function getAllContributors(req, res) {

   try {
      const repoName = req.body.repoName;

      if (repoName == null) {
         return  res.sendStatus(400).send("no repo provided");
      }

      await oracle.withOracleDB(async (connection) => {
       const result = await connection.execute(`
      SELECT Username, isOwner, readWrite
      FROM Users2 u2, UserContributesTo uc, Users1 u1, permissions p
      WHERE u2.id = uc.userid
      AND u2.email = u1.email
      AND uc.permissions = p.permissions
      AND uc.repoid = (SELECT id FROM REPO WHERE name = :repoName)
      `, { repoName: repoName});

      console.log(result);
      
      return res.json({queryResult : result});
      });
   } catch (e) {
      return res.status(400).send(e.error);
   }
}




async function createRepo(req, res) {
   try {
      const repoName = req.body.repoName;
      const username = req.body.username;

      console.log(repoName, username);

      if (!repoName || !username) {
         return res.status(400).send("repo empty");
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
            return  res.json({createdSuccess: true});
      });
   } catch (e) {
      return res.status(400).send(e.error);
   }
}



async function getRepos(req, res) {
   try {
      const username = req.body.username;
      const password = req.body.password;

      console.log(username, password);

      if (!username || !password) {
         return res.status(400).send("something went wrong");
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
      ORDER BY c.dateCreated DESC
 `, {username: username});

            console.log(result);
            return   res.json({queryResult: result});
      });
   } catch (e) {
      return res.status(400).send(e.error);
   }
}


async function getIssues(req, res) {
   try {

      const reponame = req.body.repo;
      const resolved = req.body.resolved;
      const order = req.body.order;
      const date = req.body.date;

      console.log(req.body);
      const datestring = date;// && date.toISOString().split('T')[0];

      await oracle.withOracleDB(async (connection) => {

         let result = null;

         if (resolved == "All") {
            result = await connection.execute(`
               SELECT DISTINCT i.id, i.description, i.dateResolved, i.repoID
               from Issues i, Repo r
               where r.name = :reponame
               and r.id = i.repoID
               order by i.dateResolved asc`, {reponame: reponame});
         } else if (resolved == "Unresolved") {
            result = await connection.execute(`
               SELECT DISTINCT i.id, i.description, i.dateResolved, i.repoID
               from Issues i, Repo r
               where r.name = :reponame
               and r.id = i.repoID
               and i.dateResolved is NULL`, {reponame: reponame});
         } else if (resolved == "ResolvedA") {

            if (!order || !date) {
               result = await connection.execute(`
                  SELECT DISTINCT i.id, i.description, i.dateResolved, i.repoID
                  from Issues i, Repo r
                  where r.name = :reponame 
                  and r.id = i.repoID
                  and i.dateResolved is not NULL
                  order by i.dateResolved asc`, {reponame: reponame});
            } else if (order == "on") {
               result = await connection.execute(`
                  SELECT DISTINCT i.id, i.description, i.dateResolved, i.repoID
                  from Issues i, Repo r
                  where r.name = :reponame 
                  and r.id = i.repoID
                  and i.dateResolved = to_date(:datestring, 'YYYY-MM-DD')
                  order by i.dateResolved asc`, {reponame: reponame, datestring: datestring});   
            } else if (order == "before") {
               result = await connection.execute(`
                  SELECT DISTINCT i.id, i.description, i.dateResolved, i.repoID
                  from Issues i, Repo r
                  where r.name = :reponame 
                  and r.id = i.repoID
                  and i.dateResolved < to_date(:datestring, 'YYYY-MM-DD')
                  order by i.dateResolved asc`, {reponame: reponame, datestring: datestring});
            } else {
               result = await connection.execute(`
                  SELECT DISTINCT i.id, i.description, i.dateResolved, i.repoID
                  from Issues i, Repo r
                  where r.name = :reponame 
                  and r.id = i.repoID
                  and i.dateResolved > to_date(:datestring, 'YYYY-MM-DD')
                  order by i.dateResolved asc`, {reponame: reponame, datestring: datestring});
            }

         } else {
            if (!order || !date) {
               result = await connection.execute(`
                  SELECT DISTINCT i.id, i.description, i.dateResolved, i.repoID
                  from Issues i, Repo r
                  where r.name = :reponame 
                  and r.id = i.repoID
                  and i.dateResolved is not NULL
                  order by i.dateResolved desc`, {reponame: reponame});
            } else if (order == "on") {
               result = await connection.execute(`
                  SELECT DISTINCT i.id, i.description, i.dateResolved, i.repoID
                  from Issues i, Repo r
                  where r.name = :reponame 
                  and r.id = i.repoID
                  and i.dateResolved = to_date(:datestring, 'YYYY-MM-DD')
                  order by i.dateResolved desc`, {reponame: reponame, datestring: datestring});   
            } else if (order == "before") {
               result = await connection.execute(`
                  SELECT DISTINCT i.id, i.description, i.dateResolved, i.repoID
                  from Issues i, Repo r
                  where r.name = :reponame 
                  and r.id = i.repoID
                  and i.dateResolved < to_date(:datestring, 'YYYY-MM-DD')
                  order by i.dateResolved desc`, {reponame: reponame, datestring: datestring});
            } else {
               result = await connection.execute(`
                  SELECT DISTINCT i.id, i.description, i.dateResolved, i.repoID
                  from Issues i, Repo r
                  where r.name = :reponame 
                  and r.id = i.repoID
                  and i.dateResolved > to_date(:datestring, 'YYYY-MM-DD')
                  order by i.dateResolved desc`, {reponame: reponame, datestring: datestring});
            }
         }

            console.log(result);
            res.json({queryResult: result});
      });
   } catch (e) {
      console.log(e);
      res.status(400).send(e.error);
   }
}

async function getComments(req, res) {
   try {

      const issueid = req.body.issueid;

      await oracle.withOracleDB(async (connection) => {

         const result = await connection.execute(`
            SELECT DISTINCT c.id, c.userid, c.issueId, c.message, c.timePosted, u.username
            from Comments c, Users2 u
            where c.issueId = :issueid
            and c.userid = u.id
            order by timePosted asc`, {issueid: issueid});

         console.log(result);
         res.json({queryResult: result});
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
}

async function getIssue(req, res) {
   try {

      const issueid = req.body.issueid;

      await oracle.withOracleDB(async (connection) => {

         const result = await connection.execute(`
            SELECT DISTINCT i.id, i.description, i.dateResolved, i.repoID
            from Issues i
            where i.id = :issueid`, {issueid: issueid});

         console.log(result);
         res.json({queryResult: result});
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
}

async function setResolved(req, res) {
   try {
      const issueid = req.body.issueid;

      await oracle.withOracleDB(async (connection) => {

         const result = await connection.execute(`
            DECLARE
            var_date DATE;
            BEGIN
            SELECT CURRENT_DATE INTO var_date FROM DUAL;
            UPDATE Issues i
            set dateResolved = var_date
            where i.id = :issueid;
            COMMIT;
            END;`, {issueid: issueid});

         console.log(result);
         res.json({queryResult: result});
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
}

async function deleteIssue(req, res) {
   try {

      const issueid = req.body.issueid;

      await oracle.withOracleDB(async (connection) => {

         const result = await connection.execute(`
            BEGIN
               delete from comments 
               where issueId = :issueid;

               delete from IssuesAssignedTo
               where issueId = :issueid;

               delete from Issues
               where id = :issueid;
               COMMIT;
            END;`, {issueid: issueid});

         console.log(result);
         res.json({queryResult: result});
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
}

async function makeComment(req, res) {
   try {
      const text = req.body.commenttext;
      const username = req.body.username;
      const time = req.body.time;
      const issueID = req.body.issueid;

      await oracle.withOracleDB(async (connection) => {
         const result = await connection.execute(`
      DECLARE
        var_commentID INTEGER;
        var_userid INTEGER;
      BEGIN
        SELECT MAX(id) + 1 INTO var_commentID FROM Comments;
        SELECT id INTO var_userid FROM Users WHERE username = :username;
        INSERT INTO Comments(id, userid, issueId, message, timePosted)
        VALUES (var_commentID, var_userid, :issueID, :text, :time);
        COMMIT;
      END;
            `, {username: username, issueID: issueID, text: text, time: time});

            console.log(result);
            return  res.json({createdSuccess: true});
      });
   } catch (e) {
      return res.status(400).send(e.error);
   }
}

async function makeIssue(req, res) {
   try {
      const text = req.body.text;
      const repoid = req.body.repoid;

      await oracle.withOracleDB(async (connection) => {
         const result = await connection.execute(`
      DECLARE
        var_issueID INTEGER;
      BEGIN
        SELECT MAX(id) + 1 INTO var_issueID FROM Issues;
        INSERT INTO Issues(id, description, dateResolved, repoID)
        VALUES (var_issueID, :text, NULL, :repoid);
        COMMIT;
      END;
            `, {text: text, repoid: repoid});

            console.log(result);
            return  res.json({createdSuccess: true});
      });
   } catch (e) {
      return res.status(400).send(e.error);
   }
}

async function getComment(req, res) {
   try {

      const commentid = req.body.commentid;

      await oracle.withOracleDB(async (connection) => {

         const result = await connection.execute(`
            SELECT DISTINCT c.userid, c.message, u.username
            from Comments c, Users2 u
            where c.id = :commentid
            and c.userid = u.id`, {commentid: commentid});

         console.log(result);
         res.json({queryResult: result});
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
}

async function updateComment(req, res) {
   try {

      const text = req.body.text;
      const commentid = req.body.commentid;

      await oracle.withOracleDB(async (connection) => {

         const result = await connection.execute(`
            BEGIN
                UPDATE Comments
                SET message = :text
                WHERE id = :commentid;
                COMMIT;
            END;`, {text: text, commentid: commentid});

         console.log(result);
         res.json({queryResult: result});
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
}

module.exports = { checkLogin, testOracle, executeSQL, addUserToDB, 
   checkUserHasAccessToRepo, createRepo, getRepos, getIssues, addUserToRepo, 
   getAllContributors, getComments, getIssue, setResolved, deleteIssue, 
   makeComment, makeIssue, getComment, updateComment};