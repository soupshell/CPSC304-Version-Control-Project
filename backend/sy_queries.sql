-- USE ROWNUM


--------------------------
--ISSUES PAGE FOR THE REPOSITORY

-- GET ISSUES DEFAULT (FILTERS FOR DATE ASCENDING)
SELECT DISTINCT i.id, i.description, i.dateResolved, i.repoID
from Issues i, Repo r
where r.name = 'reponame', 
and r.id = i.repoID
order by i.dateResolved asc;

-- GET ISSUES FILTERING FOR UNRESOLVED
SELECT DISTINCT i.id, i.description, i.dateResolved, i.repoID
from Issues i, Repo r
where r.name = 'reponame', 
and r.id = i.repoID
and i.dateResolved = NULL;

-- GET ISSUES FILTER FOR RESOLVED, IN ASCENDING DATE

SELECT DISTINCT i.id, i.description, i.dateResolved, i.repoID
from Issues i, Repo r
where r.name = 'reponame', 
and r.id = i.repoID,
and i.dateResolved <> NULL
order by i.dateResolved asc;

-- GET ISSUES FILTER FOR RESOLVED, DESCENDING ORDER
SELECT DISTINCT i.id, i.description, i.dateResolved, i.repoID
from Issues i, Repo r
where r.name = 'reponame', 
and r.id = i.repoID
and i.dateResolved <> NULL
order by i.dateResolved desc;


--------------------------
-- ISSUE PAGE

-- GET ISSUE, WHERE issue_id IS THE ID OF THE ISSUE THIS PAGE DISPLAYS
SELECT DISTINCT i.id, i.desc, i.dateResolved, i.repoID
from Issues i
where i.issueId = issue_id;

-- GET COMMENTS
SELECT DISTINCT c.id, c.userid, c.issueId, c.message, c.timePosted, u.username
from Comments c, Users2 u
where c.issueId = issue_id, 
and c.userid = u.userid,
order by timePosted asc;

-- TO MARK RESOLVED/UNRESOLVED, WHERE date_input IS EITHER THE DATE RESOLVED OR NULL
UPDATE Issues
set dateResolved = date_input
where i.id = issue_id;

-- TO DELETE ISSUE
delete from Issues
where id = issue_id;

--------------------------
--NEW ISSUES
-- INSERT AN ISSUE, WHERE
-- issue_id is the id of the new issue
-- issue_text is the text for the new issue, input by user
-- repo_id is the id of the repo this issue is attached to
INSERT INTO Issues(id, description, dateResolved, repoID)
VALUES (issue_id, issue_text, NULL, repo_id)

--------------------------
--NEW COMMENTS
-- INSERT A COMMENT, WHERE
-- comment_id is the id of the new comment
-- user_id is the user id of the user who posted the comment
-- issue_id is the issue this comment is attached to
-- comment_text is the text for the new comment, input by the user
-- time_posted is the time when the button to submit is clicked
INSERT INTO Comments(id, userid, issueId, message, timePosted)
VALUES (comment_id, user_id, issue_id, comment_text, time_posted)
