const oracle = require('./oracletest');


async function getFileContents(req, res) {
    try {
       const username = req.body.username;
       const password = req.body.password;
       const fileID = req.body.fileID;
       const repoName = req.body.repoName;
 
       console.log(username, password, fileID, repoName);
 
       if (username === null || password === null || fileID === null || repoName === null)  {
          res.status(400).send("empty something");
       }
 
       await oracle.withOracleDB(async (connection) => {

         const checkFileExists = await connection.execute(`
            SELECT Count(*)
            FROM Files f
            WHERE f.id = :fileID
            `, { fileID: fileID});

         if(checkFileExists.rows[0][0]){
          const result = await connection.execute(`
             SELECT Content, Path, createdOn 
             FROM Files f, Blob b
             WHERE id = :fileID
             AND f.blobhash = b.hash 
             AND EXISTS(
             SELECT *
             FROM Users2 u2, UserContributesTo uc, Repo r, Permissions p, Users1 u1
             WHERE u2.id = uc.userid
             AND u2.email = u1.email
             AND r.id = uc.repoid
             AND p.permissions = uc.permissions
             AND (p.READWRITE = 'READ' OR p.READWRITE = 'WRITE')
             AND u2.username = :username
             AND u1.hashPassword = :password
             AND r.name = :repoName
             )`, { fileID: fileID, username: username, password: password, repoName: repoName});
            return res.json({queryResult: result, validLogin: true, fileExists: true});
          }
         return  res.json({queryResult: null, validLogin: false, fileExists: false});
       });
    
    } catch (e) {
       res.status(400).send(e.error);
    }
 }

 
module.exports =  {getFileContents}