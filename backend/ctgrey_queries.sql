-- USE ROWNUM <= number as limit clause!!


--------------------------
--LOGIN PAGE
-- LOGIN submission button
select * 
from Users2 u2, Users1 u1
where u2.email = u1.email
and   u2.username = 'username'
and   u1.hashPassword = 'hashedpassword';   

-- # TODO TODO TODO !!! confirm with Team about password workings- one email has multiple passwords
-- SIGNUP submission button
-- 1) insert row
insert into Users1(email, hashPassword) VALUES ('new@gmail.com', 'nextpassword');
insert into Users2(id,username,dateJoined, email) VALUES 
   ((select max(id)+1 from Users2), 'newusername1', current_date, 'new@gmail.com');

-- handle errors #TODO

--------------------------
-- Render Users Page
-- UserList: PROJECTION
select 'values of columns inserted, check for injection'
from users1_inserted_dynamically; 

-- TODO: fix react components with new AGG stuff
-- UserList: AGGNORM
select u2.username, count(unique u_r.repoid) as "Repo Count", listagg(r.name, ', ') as "Reponames"
from Users2 u2, UserContributesTo u_r, Repo r
where u2.id = u_r.userid 
and u_r.repoid = r.id
group by u2.username;

-- UserList: AGGHAV
select u2.username, count(unique u_r.repoid) 
from Users2 u2, UserContributesTo u_r 
where u2.id = u_r.userid 
group by u2.username 
having count(unique u_r.repoid) > 1 ;

--UserList: AGGNEST
select u2.username 
from Users2 u2
where u2.dateJoined >= ALL (select dateJoined from Users2)
;

-- UserList: DIVISION
-- 1) get list of all repos
select id, name
from Repo;
-- 2) get query given user submitted list of repos
SELECT u2.username
FROM Users2 u2
WHERE NOT EXISTS
   ((SELECT 3
   FROM UserContributesTo u_r1)
   minus
   (SELECT u_r2.repoid
   FROM UserContributesTo u_r2
   WHERE u2.id = u_r2.userid));


--------------------------
-- Render Homepage
-- GIVEN USERNAME

---List all user's repositories
select *
from Users2 u2, UserContributesTo u_r, Repo r
where u2.username = 'givenUsername'
and u_r.userid = u2.id
and u_r.repoid = r.id
;

---------------------------
-- Create Repository button
-- 1. Create Repo
	INSERT INTO Repo(id,name,dateCreated) VALUES 
		((select max(id)+1 from Repo), 'reponame', current_date);
-- 2. Create Owner Permissions
	INSERT INTO UserContributesTo(userid,repoid, permissions) VALUES (1, (select max(id) from Repo), 2);
-- 3. Create initial branch
	INSERT INTO Branch(repoid,name,createdOn) VALUES
		((select max(id) from Repo), 'main', current_date);
-- 4. Create initial Folder
-- 	4a. Create initial empty Blob
	INSERT INTO Files(id, path, createdOn, blobHash) VALUES 
		((select max(id)+1 from Files), '/', current_date, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
		INSERT INTO Folders(id, numberOfFiles) VALUES ((select max(id) from Files), 0);
-- 5. Create initial Commit with folder
	INSERT INTO Commits(id,dateCreated,message,repoid,branchName,creatorUserID) VALUES 
		((select max(id)+1 from Commits), current_date, 'Initial Commit', (select max(id) from Repo), 'main', 1);
	INSERT INTO CommitsAndFolders (folderId, commitId) VALUES ((select max(id) from Files), (select max(id) from Commits));
--	



--------------------------
-- Render RepoPage
-- GIVEN USERNAME
-- get latest commit from branch name
-- starting with 'main', given repoid 
--  select to_char(datecreated, 'MM/DD/YY HH:MI:SS A.M.') from commits;
select * from (select * from commits where repoid = 1 and branchname = 'main' order by dateCreated desc) where rownum = 1;

-- given a commit, select the starting folder- non recursive for now
select * from folders f
where id = (select folderId
   from CommitsAndFolder
   where commitId = 1);

-- get contributors

-- make new branch and change branch