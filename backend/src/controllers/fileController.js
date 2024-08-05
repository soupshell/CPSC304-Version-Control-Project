const oracle = require('./oracletest');
const { createHash } = require('crypto');

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}


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
      
      const files = await getFilesFromFolderID(connection, repoName, branchName, folderId);
      const folders = await getFoldersFromFolderID(connection, repoName, branchName, folderId);
       console.log("files that fit",  files);
       console.log("folders that fit",  folders);
      res.json({queryResult: {files: files, folders: folders}});
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
      AND fil1.id = :folID
      AND NOT EXISTS (
        SELECT 1
        FROM folders fol2
        WHERE fol2.id = fil2.id
      )
        `,{folID: folderID});
 }

 async function getFoldersFromFolderID(connection, repoName, branchName, folderID){
   return await connection.execute(` 
      SELECT fil2.id, fil2.path
      FROM FilesInFolders fif, files fil1, folders fol1, files fil2, folders fol2
      WHERE fil1.id <> fil2.id
      AND fil1.id = fol1.id
      AND fif.folderID = fil1.id
      AND fif.fileID = fil2.id
      AND fil1.id = :folID
      AND fol2.id = fil2.id
        `,{folID: folderID});
 }




 async function getRootFolderID(req,res){
   const username = req.body.username;
   const password = req.body.password;
   const repoName = req.body.repoName;
   const branchName = req.body.branchName;


   if (!username || !password || !repoName || !branchName)  {
      return res.status(400).send("empty something");
   }

   console.log(username,password,repoName, branchName);
   try {
      await oracle.withOracleDB(async (connection) => {
       const access = await connection.execute(` 
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

      console.log("has access ", access);
      const hasAccess = access.rows[0][0];

      if(!hasAccess){
        return res.status(400).send("no access");
      }
      
      const fileID = await connection.execute(` 
        SELECT fil.id, commitID
        FROM folders fol, CommitsAndFolders cf, files fil
        WHERE fol.id = cf.folderid
        AND fol.id = fil.id 
        AND fil.path = '/'
        AND cf.commitid = (SELECT MAX(id)
        FROM Commits
        WHERE repoid = (SELECT id
                      FROM repo
                      WHERE name =  :repoName
                      )
       AND branchName = :branchName
 )                               
           `,{repoName, repoName, branchName: branchName});

      console.log(fileID);
      res.json({queryResult: fileID});
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
 }

 async function createFile(req, res) {
   try {
      const repoName = req.body.repoName;
      const username = req.body.username;
      const password = req.body.password;
      const fileName = req.body.fileName;
      const fileContent = req.body.fileContent;
      const branchName = req.body.branchName;
      const parentFolderID = req.body.parentFolderID;

      // put through hash function 
      const fileHash = hash(req.body.fileContent);


      console.log(repoName, username, password, fileName, fileContent, branchName, parentFolderID, fileHash);

      if (!username || ! password) {
        return res.status(400).send("bad login");
      }

      await oracle.withOracleDB(async (connection) => {
      

        // check if blob doesnt exist 
        // if it doesnt create blob from file content
        // create a new file
        // make a new commit for the current branch
        // copy folder the file resides in and make a new folder with the new file in it
        // TO DO: uhhh recursively update every folder that the new file is in

      const checkWritePermissions = await connection.execute(
         `   SELECT Count(*)
             FROM Users2 u2, Users1 u1, UserContributesTo uc, Repo r, Permissions p
             WHERE u2.id = uc.userid
             AND u2.email = u1.email
             AND r.id = uc.repoid
             AND p.permissions = uc.permissions
             AND p.READWRITE = 'WRITE' 
             AND u2.username = :username
             AND u1.hashPassword = :password
             AND r.name = :repoName
            `, {username: username, password: password, repoName: repoName});

            if(!checkWritePermissions.rows[0][0]){
              return res.status(400).send("you dont have write permissions");
            }


      const checkBlob = await connection.execute(
         `   SELECT Count(*)
             FROM Blob
             WHERE hash = :fileHash
            `, {fileHash: fileHash});


      const blobExists = checkBlob.rows[0][0];
        
      if(!blobExists){
         const makeBlob = await connection.execute(
            `
                BEGIN
                INSERT INTO Blob (hash, content) VALUES (:fileHash, :fileContent);
                COMMIT;
                END;
               `, {fileHash: fileHash, fileContent: fileContent});

               console.log(makeBlob);
      }

     const checkFileName = await connection.execute(`
      SELECT count (*)
      FROM Files f, FilesInFolders fif
      WHERE f.path =  :fileName
      AND fif.fileID = f.id
      AND fif.folderID = :parentFolderID              
   `, {fileName: fileName, parentFolderID: parentFolderID });

     if(checkFileName.rows[0][0] > 0){
      return res.status(400).send("DUPLICATE FILe");
     }
 
      const result = await connection.execute(`
      DECLARE
        var_date DATE;
        var_commitID INTEGER;
        var_userID INTEGER;
        var_folderID INTEGER;
        var_repoID INTEGER;
        var_fileID INTEGER;
      BEGIN
        SELECT id INTO var_userID FROM Users2 WHERE username = :username;
        SELECT CURRENT_DATE INTO var_date FROM DUAL;
        SELECT MAX(id) + 1 INTO var_commitID FROM Commits;
        SELECT id INTO var_repoID FROM Repo WHERE name = :repoName;
        SELECT MAX(id) + 2 INTO var_folderID FROM Files;
        SELECT MAX(id) + 1 INTO var_fileID FROM Files;

         INSERT INTO Files(id, path, createdOn, blobHash) VALUES 
              (var_fileID, :fileName, TO_DATE(var_date, 'yyyy/mm/dd'), :fileHash);
       
        INSERT INTO Commits (id, dateCreated, message, repoid, branchname, creatorUserID)
        VALUES (var_commitID, TO_DATE(var_date, 'yyyy/mm/dd'), 'added a file', var_repoID, :branchName, var_userID);

        INSERT INTO Files(id, path, createdOn, blobHash) 
        VALUES  (var_folderID, '/', TO_DATE(var_date, 'yyyy/mm/dd'), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');

	     INSERT INTO Folders(id, numberOfFiles) 
        SELECT var_folderID, numberOfFiles + 1
        FROM FOLDERS
        WHERE id = :parentFolderID;

        INSERT INTO FilesInFolders(folderId, fileId) 
        SELECT var_folderID, fileId
        FROM FilesInFolders
        WHERE folderId = :parentFolderID;

         INSERT INTO FilesInFolders(folderId, fileId) 
         VALUES (var_folderID,var_fileID);

        INSERT INTO CommitsAndFolders (folderId, commitId)
        VALUES (var_folderID, var_commitID);

        COMMIT;
      END;
   `, {repoName: repoName, branchName: branchName, parentFolderID: parentFolderID, fileHash :fileHash, username: username, fileName: fileName});

   const newFolderID = await connection.execute(` 
      SELECT max(fil.id), commitid
      FROM folders fol, CommitsAndFolders cf, files fil
      WHERE fol.id = cf.folderid
      AND fol.id = fil.id 
      AND cf.commitid = (SELECT MAX(id)
      FROM Commits
      WHERE repoid = (SELECT id
                    FROM repo
                    WHERE name =  :repoName
                    )
     AND branchName = :branchName
      )
   GROUP BY commitid                        
         `,{repoName, repoName, branchName: branchName});

      console.log("newID", newFolderID);
            return res.json({createdSuccess: true, queryResult: newFolderID});
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
}



async function createFolder(req, res) {
   try {
      const repoName = req.body.repoName;
      const username = req.body.username;
      const password = req.body.password;
      const fileName = req.body.fileName;
      const branchName = req.body.branchName;
      const parentFolderID = req.body.parentFolderID;

      console.log(repoName, username, password, fileName, branchName, parentFolderID);

      if (!repoName || !username || !password || !fileName || !branchName || !parentFolderID) {
         res.status(400).send("repo empty");
      }

      await oracle.withOracleDB(async (connection) => {


      const checkWritePermissions = await connection.execute(
            `   SELECT Count(*)
                FROM Users2 u2, Users1 u1, UserContributesTo uc, Repo r, Permissions p
                WHERE u2.id = uc.userid
                AND u2.email = u1.email
                AND r.id = uc.repoid
                AND p.permissions = uc.permissions
                AND p.READWRITE = 'WRITE' 
                AND u2.username = :username
                AND u1.hashPassword = :password
                AND r.name = :repoName
               `, {username: username, password: password, repoName: repoName});
   
               if(!checkWritePermissions.rows[0][0]){
                 return res.status(400).send("you dont have write permissions");
               }


         const checkFileName = await connection.execute(`
            SELECT count (*)
            FROM Files f, FilesInFolders fif
            WHERE f.path =  :fileName
            AND fif.fileID = f.id
            AND fif.folderID = :parentFolderID              
         `, {fileName: fileName, parentFolderID: parentFolderID });
            
           console.log(checkFileName);

           if(checkFileName.rows[0][0] > 0){
            return res.status(400).send("Duplicate Folder");
           }
       
            const insertResult = await connection.execute(`
            DECLARE
              var_date DATE;
              var_commitID INTEGER;
              var_userID INTEGER;
              var_folderID INTEGER;
              var_repoID INTEGER;
              var_fileID INTEGER;
            BEGIN
              SELECT id INTO var_userID FROM Users2 WHERE username = :username;
              SELECT CURRENT_DATE INTO var_date FROM DUAL;
              SELECT MAX(id) + 1 INTO var_commitID FROM Commits;
              SELECT id INTO var_repoID FROM Repo WHERE name = :repoName;
              SELECT MAX(id) + 2 INTO var_folderID FROM Files;
              SELECT MAX(id) + 1 INTO var_fileID FROM Files;

            INSERT INTO Files(id, path, createdOn, blobHash) VALUES 
                    (var_fileID, :fileName, TO_DATE(var_date, 'yyyy/mm/dd'), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');

               INSERT INTO Folders(id, numberOfFiles) VALUES (var_fileID, 0);
             
              INSERT INTO Commits (id, dateCreated, message, repoid, branchname, creatorUserID)
              VALUES (var_commitID, TO_DATE(var_date, 'yyyy/mm/dd'), 'added a file', var_repoID, :branchName, var_userID);
      
              INSERT INTO Files(id, path, createdOn, blobHash) 
              VALUES  (var_folderID, '/', TO_DATE(var_date, 'yyyy/mm/dd'), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
      
              INSERT INTO Folders(id, numberOfFiles) 
              SELECT var_folderID, numberOfFiles + 1
              FROM FOLDERS
              WHERE id = :parentFolderID;
      
              INSERT INTO FilesInFolders(folderId, fileId) 
              SELECT var_folderID, fileId
              FROM FilesInFolders
              WHERE folderId = :parentFolderID;
      
               INSERT INTO FilesInFolders(folderId, fileId) 
               VALUES (var_folderID, var_fileID);
      
              INSERT INTO CommitsAndFolders (folderId, commitId)
              VALUES (var_folderID, var_commitID);

              COMMIT;
            END;
         `, {repoName: repoName, branchName: branchName, parentFolderID: parentFolderID, username: username, fileName: fileName});
          
         const newFolderID = await connection.execute(` 
            SELECT max(fil.id), commitid
            FROM folders fol, CommitsAndFolders cf, files fil
            WHERE fol.id = cf.folderid
            AND fol.id = fil.id 
            AND cf.commitid = (SELECT MAX(id)
            FROM Commits
            WHERE repoid = (SELECT id
                          FROM repo
                          WHERE name =  :repoName
                          )
           AND branchName = :branchName
         )
           GROUP BY commitid

      `,{repoName, repoName, branchName: branchName});
      
               console.log("newID", newFolderID);
               return res.json({createdSuccess: true, queryResult: newFolderID});
            });
         } catch (e) {
            res.status(400).send(e.error);
         }
}


 
module.exports =  {getFileContents, getFilesAndFolders, getRootFolderID, createFile, createFolder}