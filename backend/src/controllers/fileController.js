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
           

            // to do: try to make a better qurey
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


 async function getFilesAndFolders(req, res) {
   const username = req.body.username;
   const password = req.body.password;
   const repoName = req.body.repoName;
   const branchName = req.body.branchName;
   const folderId = req.body.currentFolderID;


   if (!username || !password || !repoName || !branchName || !folderId)  {
      res.status(400).send("empty something");
   }

   console.log(username,password,repoName, branchName);
   try {
      await oracle.withOracleDB(async (connection) => {
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

      console.log("has access ", result);
      const hasAccess = result.rows[0][0];

      if(!hasAccess){
        return res.status(400).send("no access");
      }
      
      const  files = await getFilesFromFolderID(connection, repoName, branchName, folderId);
       console.log("files that fit",  files);
      res.json({queryResult: files});
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
}

async function getFilesFromFolderID(connection, repoName, branchName, folderID){
   return await connection.execute(` 
      SELECT fil2.id, fil2.path
      FROM FilesInFolders fif, files fil1, folders fol1, files fil2
      WHERE fil1.id <> fil2.id
      AND fil1.id = fol1.id
      AND fif.folderID = fil1.id
      AND fif.fileID = fil2.id
      AND fil1.id = (SELECT fil.id 
                 FROM folders fol, CommitsAndFolders cf, files fil
                 WHERE fol.id = :folderID
                 AND fol.id = cf.folderid
                 AND fol.id = fil.id 
                  AND cf.commitid = (SELECT DISTINCT MAX(id)
                                    FROM Commits
                                     WHERE datecreated = (SELECT DISTINCT max(datecreated)
                                                           FROM commits 
                                                           WHERE repoid = ( SELECT id
                                                                           FROM repo
                                                                           WHERE name = :repoName
                                                                           )
                                                            AND branchName = :branchName
                                                     )
                                 )  
               )       
        `,{repoName, repoName, branchName: branchName, folderID: folderID});
 }


 async function getRootFolderID(req,res){
   const username = req.body.username;
   const password = req.body.password;
   const repoName = req.body.repoName;
   const branchName = req.body.branchName;


   if (!username || !password || !repoName || !branchName)  {
      res.status(400).send("empty something");
   }

   console.log(username,password,repoName, branchName);
   try {
      await oracle.withOracleDB(async (connection) => {
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

      console.log("has access ", result);
      const hasAccess = result.rows[0][0];

      if(!hasAccess){
        return res.status(400).send("no access");
      }
      
      const fileID = await connection.execute(` 
        SELECT fil.id, commitID
        FROM folders fol, CommitsAndFolders cf, files fil
        WHERE fol.id = cf.folderid
        AND fol.id = fil.id 
        AND cf.commitid = (SELECT DISTINCT MAX(id)
                            FROM Commits
                            WHERE datecreated = (SELECT DISTINCT max(datecreated)
                                                  FROM commits 
                                                     WHERE repoid = ( SELECT id
                                                                      FROM repo
                                                                     WHERE name = :repoName
                                                                    )
                            AND branchName = :branchName
                                                  )
                            )                       
           `,{repoName, repoName, branchName: branchName});

      console.log(fileID);
      res.json({queryResult: fileID});
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
 }


 
module.exports =  {getFileContents, getFilesAndFolders, getRootFolderID}