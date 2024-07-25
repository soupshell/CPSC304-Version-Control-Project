--
-- 	Database Table Creation
--
--	This file will create the tables for use with the book
--
--	Version 0.0.0.0 2024/07/24 by: Charity Grey.
--
--  First drop any existing tables. Any errors are ignored.
--

drop table Users1 cascade constraints;
drop table Users2 cascade constraints;
drop table Repo cascade constraints;
drop table Issues cascade constraints;
drop table Comments cascade constraints;
drop table Branch cascade constraints;
drop table Commits cascade constraints;
drop table Blob cascade constraints;
drop table Files cascade constraints;
drop table Folders cascade constraints;
drop table IssuesAssignedTo cascade constraints;
drop table Permissions cascade constraints;
drop table UserContributesTo cascade constraints;
drop table FilesInFolders cascade constraints;
drop table CommitsAndFolders cascade constraints;


--
-- Now, add each table.
--
CREATE TABLE Users1 (
	email VARCHAR(320),
	hashPassword VARCHAR(50),
	PRIMARY KEY (email)
);

CREATE TABLE Users2(
id INT, 
username VARCHAR(30) UNIQUE NOT NULL, 
dateJoined DATE, 
email VARCHAR(320) NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (email)
	REFERENCES Users1(email)
);

CREATE TABLE Repo(
	id INT, 
	name VARCHAR(50) UNIQUE NOT NULL,
	dateCreated DATE,
	PRIMARY KEY (id)
);

CREATE TABLE Issues(
	id INT,
	description VARCHAR(50),
	dateResolved DATE, 
	repoID INT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (repoID)
		REFERENCES Repo(id)
);

CREATE TABLE Comments(
	id INT,
	userid INT NOT NULL,
	issueId INT NOT NULL,
	message VARCHAR(1000),
	timePosted DATE,
	PRIMARY KEY (id),
	FOREIGN KEY (userid)
		REFERENCES Users2(id),
	FOREIGN KEY (issueId)
		REFERENCES Issues(id)
);

CREATE TABLE Branch(
	repoid INT NOT NULL,
	name VARCHAR(100),
	createdOn DATE,
	PRIMARY KEY (repoid, name),
	FOREIGN KEY (repoid)
		REFERENCES Repo(id)
);

CREATE TABLE Commits(
	id INT,
	dateCreated DATE,
	message VARCHAR(250),
	repoid INT NOT NULL,
	branchName varchar(50) NOT NULL,
	creatorUserID INT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (repoid, branchName)
		REFERENCES Branch(repoid, name),
	FOREIGN KEY (creatorUserID)
		REFERENCES Users2(id)
);

CREATE TABLE Blob(
	hash VARCHAR(64),
	content VARCHAR2(4000),
	PRIMARY KEY (hash)
);

CREATE TABLE Files(
	id INT,
	path VARCHAR(4000) NOT NULL,
	createdOn DATE,
	blobHash VARCHAR(64) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (blobHash)
		REFERENCES Blob(hash)
);

CREATE TABLE Folders(
	id INT,
	numberOfFiles INT,
	PRIMARY KEY (id),
	FOREIGN KEY (id)
		REFERENCES Files(id)
);

CREATE TABLE IssuesAssignedTo(
	userid INT,
	issueid INT,
	PRIMARY KEY (userid, issueid),
	FOREIGN KEY (userid)
		REFERENCES Users2(id),
	FOREIGN KEY (issueid)
		REFERENCES Issues(id)
);


CREATE TABLE Permissions(
	permissions INT,
	readWrite VARCHAR(5) NOT NULL,
	isOwner NUMBER(1) NOT NULL,
	PRIMARY KEY (permissions)
);

CREATE TABLE UserContributesTo (
	userid INT,
	repoid INT,
	permissions INT,
	PRIMARY KEY (userid, repoid),
	FOREIGN KEY (userid)
		REFERENCES Users2(id),
	FOREIGN KEY (repoid)
		REFERENCES Repo(id),
	FOREIGN KEY (permissions)
		REFERENCES Permissions(permissions)
);

CREATE TABLE CommitsAndFolders(
	folderId INT,
	commitId INT,
	PRIMARY KEY (folderId , commitId),
	FOREIGN KEY (folderId)
		REFERENCES Folders(id),
	FOREIGN KEY (commitId)
		REFERENCES Commits(id)
);

CREATE TABLE FilesInFolders(
	FolderID INT,
	FileID INT,
	PRIMARY KEY (FolderID , FileID),
	FOREIGN KEY (folderId)
		REFERENCES Folders(id),
	FOREIGN KEY (FileID)
		REFERENCES Files(id)
);



--
-- done adding all of the tables, now add in some tuples

-- insert all Users
INSERT INTO Users1(email, hashPassword) VALUES ('test@gmail.com', '12345678910');
INSERT INTO Users1(email, hashPassword) VALUES ('sheep@gmail.com', '3247104203914870');
INSERT INTO Users1(email, hashPassword) VALUES ('cow@gmail.com', '987041142');
INSERT INTO Users1(email, hashPassword) VALUES ('cat@gmail.com', '904872135');
INSERT INTO Users1(email, hashPassword) VALUES ('mouse@gmail.com', '701497098');

INSERT INTO Users2(id,username,dateJoined, email) VALUES
(1, 'test_account', TO_DATE('2024/07/03', 'yyyy/mm/dd'), 'test@gmail.com');
INSERT INTO Users2(id,username,dateJoined, email) VALUES 
(2, 'iamasheep', TO_DATE('2024/07/04', 'yyyy/mm/dd'), 'sheep@gmail.com');
INSERT INTO Users2(id,username,dateJoined, email) VALUES 
(3, 'old_mcdonald', TO_DATE('2024/07/05', 'yyyy/mm/dd'), 'cow@gmail.com');
INSERT INTO Users2(id,username,dateJoined, email) VALUES 
(4, 'cat_account1', TO_DATE('2024/07/06', 'yyyy/mm/dd'), 'cat@gmail.com');
INSERT INTO Users2(id,username,dateJoined, email) VALUES 
(5, 'cat_account2', TO_DATE('2024/07/07', 'yyyy/mm/dd'), 'cat@gmail.com');

--Set up Permissions table
INSERT INTO Permissions(permissions,readWrite,isOwner) VALUES  (1, 'READ', 1);
INSERT INTO Permissions(permissions,readWrite,isOwner) VALUES  (2, 'WRITE', 1);
INSERT INTO Permissions(permissions,readWrite,isOwner) VALUES  (3, 'READ', 0);
INSERT INTO Permissions(permissions,readWrite,isOwner) VALUES  (4, 'WRITE', 0);

--
-- Insert Repositories as they come
-- 1. Create Repo
-- 2. Create Owner Permissions
-- 3. Create initial branch
-- 4. Create initial Folder
-- 	4a. Create initial empty Blob
-- 5. Create initial Commit with Folder
--


-- CREATE DEMO REPO 1
-- 1. Create Repo
	INSERT INTO Repo(id,name,dateCreated) VALUES 
		(1, 'test_repository', TO_DATE('2024/07/08', 'yyyy/mm/dd'));
-- 2. Create Owner Permissions
	INSERT INTO UserContributesTo(userid,repoid, permissions) VALUES (1, 1, 2);
-- 3. Create initial branch
	INSERT INTO Branch(repoid,name,createdOn) VALUES
		(1, 'main', TO_DATE('2024/07/08', 'yyyy/mm/dd'));
-- 4. Create initial Folder
-- 	4a. Create initial empty Blob
	INSERT INTO Blob (hash, content)  VALUES 
		('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855','');
	INSERT INTO Files(id, path, createdOn, blobHash) VALUES 
		(1, '/', TO_DATE('2024/07/08', 'yyyy/mm/dd'), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
	INSERT INTO Folders(id, numberOfFiles) VALUES (1, 0);
-- 5. Create initial Commit with folder
	INSERT INTO Commits(id,dateCreated,message,repoid,branchName,creatorUserID) VALUES 
		(1, TO_DATE('2024/07/08 14:28:21', 'yyyy/mm/dd hh24:mi:ss'), 'Initial Commit', 1, 'main', 1);
	INSERT INTO CommitsAndFolders (folderId, commitId) VALUES (1, 1);
--	


-- CREATE DEMO REPO 2
-- 1. Create Repo
	INSERT INTO Repo(id,name,dateCreated) VALUES 
		(2, 'second_test_repository', TO_DATE('2024/07/09', 'yyyy/mm/dd'));
-- 2. Create Owner Permissions
	INSERT INTO UserContributesTo(userid,repoid, permissions) VALUES (1, 2, 2);
-- 3. Create initial branch
	INSERT INTO Branch(repoid,name,createdOn) VALUES
		(2, 'main', TO_DATE('2024/07/09', 'yyyy/mm/dd'));
-- 4. Create initial Folder
-- 	4a. Create initial empty Blob
	INSERT INTO Files(id, path, createdOn, blobHash) VALUES 
		(2, '/', TO_DATE('2024/07/09', 'yyyy/mm/dd'), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
		INSERT INTO Folders(id, numberOfFiles) VALUES (2, 0);
-- 5. Create initial Commit with folder
	INSERT INTO Commits(id,dateCreated,message,repoid,branchName,creatorUserID) VALUES 
		(2, TO_DATE('2024/07/09 07:32:21', 'yyyy/mm/dd hh24:mi:ss'), 'Initial Commit', 2, 'main', 1);
	INSERT INTO CommitsAndFolders (folderId, commitId) VALUES (2, 2);
--	

-- CREATE DEMO REPO 3
-- 1. Create Repo
	INSERT INTO Repo(id,name,dateCreated) VALUES 
		(3, 'react_app', TO_DATE('2024/07/10', 'yyyy/mm/dd'));
-- 2. Create Owner Permissions
	INSERT INTO UserContributesTo(userid,repoid, permissions) VALUES (3, 3, 2);
-- 3. Create initial branch
	INSERT INTO Branch(repoid,name,createdOn) VALUES
		(3, 'main', TO_DATE('2024/07/10', 'yyyy/mm/dd'));
-- 4. Create initial Folder
-- 	4a. Create initial empty Blob
	INSERT INTO Files(id, path, createdOn, blobHash) VALUES 
		(3, '/', TO_DATE('2024/07/09', 'yyyy/mm/dd'), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
		INSERT INTO Folders(id, numberOfFiles) VALUES (3, 0);
-- 5. Create initial Commit with folder
	INSERT INTO Commits(id,dateCreated,message,repoid,branchName,creatorUserID) VALUES 
		(3, TO_DATE('2024/07/09 07:32:21', 'yyyy/mm/dd hh24:mi:ss'), 'Initial Commit', 3, 'main', 3);
	INSERT INTO CommitsAndFolders (folderId, commitId) VALUES (3, 3);
--	


-- 
-- User Insert/Update File
-- 1. Create new version of File
-- 	1a. Create new Blob if needed, potentially require us to change sqlterminator
-- 2. Create necessary new Folders, including updating numberOffiles attribute
-- 3. Put all files and folders into new folder
--		NOTE: the entire folder path that was changed must be created anew, but all other files that were not changed can be reused
--		EX: / has files A and Folder B and C; B/ has files D; C/ has files E
--			 You change files E: This requires: new folder /, new folder C, and new file E. The remaining can be left the same
-- 4. Create new Commit and attach Folder
--

-- INSERT DEMO FILE
-- User Insert/Update File
-- 1. Create new version of File
-- 	1a. Create new Blob if needed, potentially require us to change sqlterminator
INSERT INTO Blob (hash, content)  VALUES ('DF3B852F0FD6EA481761D2DFD2CBE5479B49F7D48D863CB79D1B54C0C285EC5F',
	'#include <iostream>
	const int n = 3
	const int DSIZE = 10
	const int block_size = 32'
);
INSERT INTO Files(id, path, createdOn, blobHash) VALUES 
	(4, '/hello.cpp', TO_DATE('2024/07/11', 'yyyy/mm/dd'), 'DF3B852F0FD6EA481761D2DFD2CBE5479B49F7D48D863CB79D1B54C0C285EC5F');
-- 2. Create necessary new Folders, including updating numberOffiles attribute
INSERT INTO Files(id, path, createdOn, blobHash) VALUES 
		(5, '/', TO_DATE('2024/07/11', 'yyyy/mm/dd'), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
INSERT INTO Folders(id, numberOfFiles) VALUES (5, 1);
-- 3. Put all files and folders into new folder
--		NOTE: the entire folder path that was changed must be created anew, but all other files that were not changed can be reused
--		EX: / has files A and Folder B and C; B/ has files D; C/ has files E
--			 You change files E: This requires: new folder /, new folder C, and new file E. The remaining can be left the same
INSERT INTO FilesInFolders(folderId, fileId) VALUES (5,4);
-- 4. Create new Commit and attach Folder
INSERT INTO Commits(id,dateCreated,message,repoid,branchName,creatorUserID) VALUES 
	(4, TO_DATE('2024/07/11 16:42:00', 'yyyy/mm/dd hh24:mi:ss'), 'added file 1', 1, 'main', 1);
INSERT INTO CommitsAndFolders (folderId, commitId) VALUES (5,4);
--


-- UPDATE DEMO FILE
-- User Insert/Update File
-- 1. Create new version of File
-- 	1a. Create new Blob if needed, note, potentially require us to change sqlterminator
set sqlterminator "~"
INSERT INTO Blob (hash, content)  VALUES ('DF3B852F0FD6EA481761D2DFD2CBE5479B49F8D87658B69D1B54C0C285EC5F',
	'#include <iostream>
	const int n = 3;
	const int DSIZE = 10;
	const int block_size = 32;'
)~
set sqlterminator ";"
INSERT INTO Files(id, path, createdOn, blobHash) VALUES 
	(6, '/hello.cpp', TO_DATE('2024/07/11', 'yyyy/mm/dd'), 'DF3B852F0FD6EA481761D2DFD2CBE5479B49F8D87658B69D1B54C0C285EC5F');
-- 2. Create necessary new Folders, including updating numberOffiles attribute
INSERT INTO Files(id, path, createdOn, blobHash) VALUES 
		(7, '/', TO_DATE('2024/07/11', 'yyyy/mm/dd'), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
INSERT INTO Folders(id, numberOfFiles) VALUES (7, 1);
-- 3. Put all files and folders into new folder
--		NOTE: the entire folder path that was changed must be created anew, but all other files that were not changed can be reused
--		EX: / has files A and Folder B and C; B/ has files D; C/ has files E
--			 You change files E: This requires: new folder /, new folder C, and new file E. The remaining can be left the same
INSERT INTO FilesInFolders(folderId, fileId) VALUES (7,6);
-- 4. Create new Commit and attach Folder
INSERT INTO Commits(id,dateCreated,message,repoid,branchName,creatorUserID) VALUES 
	(5, TO_DATE('2024/07/11 17:01:00', 'yyyy/mm/dd hh24:mi:ss'), 'added semicolons in file', 1, 'main', 1);
INSERT INTO CommitsAndFolders (folderId, commitId) VALUES (7,5);
--

-- INSERT DEMO FILE 2
-- User Insert/Update File
-- 1. Create new version of File, 
-- 	1a. Create new Blob if needed, potentially require us to change sqlterminator
INSERT INTO Blob (hash, content)  VALUES ('A8SNS9SA0FD6EA481761D2DFD2CBE5479B49F7D48D863CB79D1B54C0C285EC5F',
	'test file, hello world!!'
);
INSERT INTO Files(id, path, createdOn, blobHash) VALUES 
	(8, '/file2.txt', TO_DATE('2024/07/11', 'yyyy/mm/dd'), 'A8SNS9SA0FD6EA481761D2DFD2CBE5479B49F7D48D863CB79D1B54C0C285EC5F');
-- 2. Create necessary new Folders, including updating numberOffiles attribute
INSERT INTO Files(id, path, createdOn, blobHash) VALUES 
		(9, '/', TO_DATE('2024/07/11', 'yyyy/mm/dd'), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
INSERT INTO Folders(id, numberOfFiles) VALUES (9, 2);
-- 3. Put all files and folders into new folder
--		NOTE: the entire folder path that was changed must be created anew, but all other files that were not changed can be reused
--		EX: / has files A and Folder B and C; B/ has files D; C/ has files E
--			 You change files E: This requires: new folder /, new folder C, and new file E. The remaining can be left the same
-- Ex: Below is old file hello.cpp
INSERT INTO FilesInFolders(folderId, fileId) VALUES (9,6); 
-- Ex: Below is new file file2.txt
INSERT INTO FilesInFolders(folderId, fileId) VALUES (9,8); 
-- 4. Create new Commit and attach Folder
INSERT INTO Commits(id,dateCreated,message,repoid,branchName,creatorUserID) VALUES 
	(6, TO_DATE('2024/07/11 17:34:00', 'yyyy/mm/dd hh24:mi:ss'), 'added file 2', 1, 'main', 1);
INSERT INTO CommitsAndFolders (folderId, commitId) VALUES (9,6);
--

--
-- User Delete File
-- 1. Create necessary new Folders
-- 2. Put all files and folders into new folder
--		NOTE: the entire folder path that was changed must be created anew, but all other files that were not changed can be reused
--		EX: / has files A and Folder B and C; B/ has files D; C/ has files E
--			 You change files E: This requires: new folder /, new folder C, and new file E. The remaining can be left the same
-- 3. Create new Commit and attach Folder
--

-- DELETE DEMO FILE
-- User Delete File
-- 1. Create necessary new Folders, including reducing numberOffiles attribute
INSERT INTO Files(id, path, createdOn, blobHash) VALUES 
		(10, '/', TO_DATE('2024/07/11', 'yyyy/mm/dd'), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
-- Note: See we reduce numberOfFile
INSERT INTO Folders(id, numberOfFiles) VALUES (10, 1);
-- 2. Put all files and folders into new folder EXCEPT for file you are deleting
--		NOTE: the entire folder path that was changed must be created anew, but all other files that were not changed can be reused
--		EX: / has files A and Folder B and C; B/ has files D; C/ has files E
--			 You change files E: This requires: new folder /, new folder C, and new file E. The remaining can be left the same
INSERT INTO FilesInFolders(folderId, fileId) VALUES (10,6);
-- 3. Create new Commit and attach Folder
INSERT INTO Commits(id,dateCreated,message,repoid,branchName,creatorUserID) VALUES 
	(7, TO_DATE('2024/07/11 18:09:00', 'yyyy/mm/dd hh24:mi:ss'), 'deleted file 2', 1, 'main', 1);
INSERT INTO CommitsAndFolders (folderId, commitId) VALUES (10,7);

