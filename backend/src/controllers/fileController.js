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

         const checkFileExists =  await connection.execute(`
            SELECT Count(*)
            FROM Files f
            WHERE f.id = :fileID
            `, { fileID: fileID});
           
            console.log("file exists", checkFileExists);

            if(!checkFileExists.rows[0][0]){
             return  res.json({queryResult: null, validLogin: false, fileExists: false});
            }

         const checkFilePermissions = await connection.execute(`
             SELECT Count(*)
             FROM Users2 u2, UserContributesTo uc, Repo r, Permissions p, Users1 u1, Commits c, Branch b, CommitsAndFolders cf, Folders fol, Files fil, FilesInFolders fif
             WHERE u2.id = uc.userid
             AND u2.email = u1.email
             AND r.id = uc.repoid
             AND p.permissions = uc.permissions
             AND (p.READWRITE = 'READ' OR p.READWRITE = 'WRITE')  
             AND b.repoid = r.id
             AND b.repoid = c.repoid
             AND c.id = cf.commitId
             AND fol.id = cf.folderId 
             AND fif.FolderID = fol.id
             AND fif.FileID = fil.id
             AND u2.username = :username
             AND u1.hashPassword = :password
             AND r.name = :repoName
             AND fil.id = :fileID`, {username: username, password: password, repoName: repoName, fileID: fileID});
             
             console.log("file permissions", checkFilePermissions);

             if(checkFilePermissions.rows[0][0] == 0){
               return res.json({queryResult: null, validLogin: false, fileExists: true});
              }

             const fileContent = await connection.execute(`
             SELECT Content, Path, createdOn 
             FROM Files f, Blob b
             WHERE id = :fileID
             AND f.blobhash = b.hash 
             `, { fileID: fileID});
             
            console.log(fileContent);
            return res.json({queryResult: fileContent, validLogin: true, fileExists: true});
       });
    
    } catch (e) {
       res.status(400).send(e.error);
    }
 }

 
module.exports =  {getFileContents}