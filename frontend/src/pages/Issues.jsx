import RepoHeader from "../components/RepoHeader";
import IssueLinkBox from "../components/IssueLinkBox";
import { useParams, Link } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';

function Issues(props) { 
    //we redirect here from a RepoHome page, so the ID is passed along

    //then, query for all the Issues with foreign key repoid = param repoID

    const {user, repo} = useParams(); // access params.id

    const [issues, setIssues] = useState([]);

    //pretend this is every issue from the table, and that it's been queried
    //to select the ones with the repoID we want
    
    // const issuesData = [
    //     {'id': 1,
    //     'description': '123456789 123456789 123456789 123456789 1234567890',
    //     'dateResolved': '12-31-2023',
    //     'repoID': 1
    //     },
    //     {'id': 2,
    //         'description': 'less than 50 but still long (2)',
    //         'dateResolved': null, //issue is unresolved
    //         'repoID': 1
    //     },
    //     {'id': 3,
    //         'description': 'less long (3)',
    //         'dateResolved': '12-30-2023',
    //         'repoID': 1
    //     },
    //     {'id': 4,
    //         'description': 'issue no 4',
    //         'dateResolved': '02-07-2021',
    //         'repoID': 1
    //     },
    // ];

    async function fetchIssues(filter) {
      try {
        const result = await getIssues(repo, filter);
        if(result && result.queryResult && Array.isArray(result.queryResult.rows)){
          const issues = []
           result.queryResult.rows.forEach((row) => {
           const id = row[0];
           const description = row[1];
           const dateResolved =  row[2];
           const repoID = row[3];
    
           issues.push({'id': id,
            'description': description,
            'dateResolved': dateResolved,
            'repoID': repoID
          })
        });
          setIssues(issues);
          //console.log(result.queryResult);
        }
      } catch (e) {
        console.log(e);
      }
    }
    
      useEffect(() => {
        fetchIssues("");
      }, []);

    //procedurally render all issues into buttons. 

    const listItems = issues.map(issue => <li className='ctgrey-li'><IssueLinkBox issueInfo={issue} /></li>);


    return (
        //regular header + list of issues + buttons to filter for unresolved and filter for after date
        <>
        <RepoHeader />
        <div>
        <div className="centerDiv">
          <h2>
            Repo <i>{repo}</i>'s Issues Page
          </h2>
          <button onClick={fetchIssues("unresolved")}>Select Unresolved</button>
          <button onClick={fetchIssues("resolved asc")}>Select Resolved by date (ascending)</button>
          <button onClick={fetchIssues("resolved desc")}>Select Resolved by date (descending)</button>
        </div>
        <div className="centerDiv">
          <ul className='centerColDiv'>
            Issues
            {listItems}
          </ul>
          <div >
            <Link className='ctgrey-button' to={`/${user}/${repo}`}>Go back to repo</Link>
            <Link className='ctgrey-button' to='/New'>Make new issue</Link>
          </div>
        </div>
        </div>
      </>
    );
}

export default Issues;