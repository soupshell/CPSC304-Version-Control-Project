import RepoHeader from "../components/RepoHeader";
import { useParams, Link } from "react-router-dom";
import { getIssue, getComments, setResolved, deleteIssue} from "../controller/controller";
import { useState } from 'react';
import { useEffect } from 'react';

function IssuePage(props) { 
    //then, query for all the Issues with foreign key repoid = param repoID
    const {User, Repo, Issues} = useParams(); // access params.id
    
    const loggedInUser = sessionStorage.getItem("isVerified");
    const [issueid, setIssueID] = useState(Issues);
    const [issuedesc, setIssueDesc] = useState("");
    const [issuedate, setIssueDate] = useState(null);
    const [repoid, setRepoid] = useState(0);
    const [comments, setComments] = useState([]);


    //we get sample issue from db, and then query comments to get chronological 
    //comments relating to this issue
    // const issue = {
    //     'id': 16,
    //     'description': '123456789 123456789 123456789 123456789 1234567890',
    //     'dateResolved': '12-31-2023',
    //     'repoID': 7
    // }
    // const comments = [
    //     {'id': 1,
    //         'userid': 10,
    //         'issueId': 16,
    //         'message': 'message for comment 1',
    //         'timePosted': '11:02:04',
    //         'username': 'firstuser'
    //     },
    //     {'id': 2,
    //         'userid': 17,
    //         'issueId': 16,
    //         'message': 'message for comment 2',
    //         'timePosted': '12:03:17',
    //         'username': 'user2'
    //     },
    //     {'id': 3,
    //         'userid': 1,
    //         'issueId': 16,
    //         'message': 'message for comment 3',
    //         'timePosted': '14:16:00',
    //         'username': 'user3'
    //     },
    //     {'id': 4,
    //         'userid': 2,
    //         'issueId': 16,
    //         'message': 'message for comment 4',
    //         'timePosted': '20:02:04', //so we don't have date? idk how time works
    //         'username': 'user4'
    //     },
    // ];

    async function fetchComments() {
      try {
        const result = await getComments(issueid);
        console.log(result);
        if(result && result.queryResult && Array.isArray(result.queryResult.rows)){
          const comments = []
           result.queryResult.rows.forEach((row) => {
           const id = row[0];
           const userid = row[1];
           const issueId =  row[2];
           const message = row[3];
           const timePosted = row[4];
           const username = row[5];
    
           comments.push({'id': id,
             'userid': userid,
             'issueId': issueId,
             'message': message,
             'timePosted': timePosted,
             'username': username
          })
          });
          setComments(comments);
          //console.log(result.queryResult);
        }
      } catch (e) {
        console.log(e);
      }
    }

    async function fetchIssue() {
      try {
        const result = await getIssue(issueid);
        if(result && result.queryResult && Array.isArray(result.queryResult.rows)){
          //const issues = []
           result.queryResult.rows.forEach((row) => {
           setIssueDesc(row[1]);
           setIssueDate(row[2]);
           setRepoid(row[3]);
        });
          //console.log(result.queryResult);
        }
      } catch (e) {
        console.log(e);
      }
    }

    useEffect(() => {
      fetchComments();
      fetchIssue();
    }, []);

    //comment.userid is a replacement for username

    const listItems = comments.map(comment => <li className='ctgrey-li'>
        <div>{comment.username}</div>
        <div>{comment.timePosted}</div>
        <div>{comment.message}</div>
    </li>);

    if (issuedate == null) {
      return (
        <>
        <RepoHeader />
        <div>
        <div className="centerDiv">
          <h2>
            Repo <i>{Repo}</i>'s Issues Page
          </h2>
        </div>
        <div className="centerDiv">
          <div >
            <Link className='ctgrey-button' to={`/${User}/${Repo}/Issues`}>Go back to issues</Link>
            <button onClick={async (e) => { 
              const res = await setResolved(new Date().toLocaleDateString, issueid);
              await fetchIssue();
            }}>Mark Resolved</button>

            <Link className='ctgrey-button' to={`/${User}/${Repo}/Issues`}>
                <button onClick={(e) => {
                  e.preventDefault();
                  const res = deleteIssue(issueid);
                }}>Delete this issue</button>
            </Link>
            
            <Link className='ctgrey-button' to={`/New`}>Add new comment</Link>
          </div>
          <ul className='centerColDiv'>
            {issuedate}
            {issuedesc}
          </ul>
          <ul className='centerColDiv'>
            {listItems}
          </ul>
          
        </div>
        </div>
        </>
      );
    }


    return (
        <>
        <RepoHeader />
        <div>
        <div className="centerDiv">
          <h2>
            Repo <i>{Repo}</i>'s Issues Page
          </h2>
        </div>
        <div className="centerDiv">
          <div >
            <Link className='ctgrey-button' to={`/${User}/${Repo}/Issues`}>Go back to issues</Link>
            <button onClick={async (e) => { 
              const res = await setResolved(null, issueid);
              await fetchIssue();
            }}>Mark Unresolved</button>
            <Link className='ctgrey-button' to={`/${User}/${Repo}/Issues`}>
                <button onClick={(e) => {
                  e.preventDefault();
                  const res = deleteIssue(issueid);
                }}>Delete this issue</button>
            </Link>
            <Link className='ctgrey-button' to={`/New`}>Add new comment</Link>
          </div>
          <ul className='centerColDiv'>
            {issuedate}
            {issuedesc}
          </ul>
          <ul className='centerColDiv'>
            {listItems}
          </ul>
          
        </div>
        </div>
      </>
    );
}

//the button doesn't do anything onclick yet but it should mark issue as resolved
//which changes the date
//idk if the link to new comment works either

export default IssuePage;