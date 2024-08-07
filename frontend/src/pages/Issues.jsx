import RepoHeader from "../components/RepoHeader";
import IssueLinkBox from "../components/IssueLinkBox";
import { useParams, Link } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';
import { getIssues } from "../controller/controller";

function Issues(props) { 
    //we redirect here from a RepoHome page, so the ID is passed along

    //then, query for all the Issues with foreign key repoid = param repoID

    const params = useParams(); // access params.id
    const user = params.User;
    const repo = params.Repo;
    const [issues, setIssues] = useState([]);
    const [parameters, setParameters] = useState({
      resolved: null,
      order: null,
      date: null
    });

    async function fetchIssues(param) {
      try {
        const resolved = param.resolved;
        const order = param.order;
        const date = param.date;
        const result = await getIssues(repo, resolved, order, date);
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
        fetchIssues({
          resolved: "All",
          order: null,
          date: null
        });
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

          <form onSubmit={() => fetchIssues(parameters)}>
          <label for="isresolved">Is Resolved:</label>

          <select name="isresolved" id="resolvedOptions" 
          onchange={(event) => setParameters({
            resolved: event.target.value, 
            order: parameters.order, 
            date: parameters.date})}>
            <option value="All">All</option>
            <option value="Unresolved">Unresolved</option>
            <option value="ResolvedA">Resolved (ascending)</option>
            <option value="ResolvedD">Resolved (descending)</option>
          </select> 

          {((parameters.resolved == "ResolvedA") || (parameters.resolved == "ResolvedD")) 
          && 
          <>
          <label for="order">Resolved Before</label>

          <select name="order" id="order" onchange={(event) => setParameters({
            resolved: parameters.resolved, 
            order: event.target.value, 
            date: parameters.date})}>
            <option value="before">Before date</option>
            <option value="after">After date</option>
            <option value="on">On date</option>
          </select>

          <input type="date" id={'date'} onchange={(event) => setParameters({
            resolved: parameters.resolved, 
            order: parameters.order, 
            date: event.target.value
          })}></input>
          </>
          }

          <input type="submit" value="Submit"></input>
          </form>

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