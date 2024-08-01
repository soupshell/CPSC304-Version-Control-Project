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
insert into Users1;

-- handle errors

--------------------------
-- Render Users Page
-- UserList: PROJECTION
-- 1- get all table names
select table_name from user_tables;
-- 2- get all column names
select column_name from all_tab_cols
where table_name = 'USERS1';
-- 3- get projection
select 'values of columsn inserted, check for injection'
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
((SELECT u_r1.repoid
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

--create Repository button


--------------------------
-- Render RepoPage
-- GIVEN USERNAME