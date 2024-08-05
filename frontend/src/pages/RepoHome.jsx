import RepoHeader from "../components/RepoHeader";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFilesAndFolders, getRootFolderID } from "../controller/controller";

function RepoHome(props) {
  const params = useParams(); // access params.id
  const loggedInUser = sessionStorage.getItem("isVerified");
  const currentUserPassword = sessionStorage.getItem("password");
 
  useEffect(() => {
    async function check() {
     try{
    const auth = await getRootFolderID(loggedInUser,currentUserPassword, repoState.repoName, repoState.currBranchName);


    if(auth === false) {
      console.log(auth);
      setRepoState(null);
      return;
    }

    const folderID = auth.queryResult.rows[0][0];
    const commitId = auth.queryResult.rows[0][1];
    const result = await getFilesAndFolders(loggedInUser,currentUserPassword, repoState.repoName, repoState.currBranchName, folderID);

    const files = result.queryResult.rows;

    console.log("files", files);
    
    setRepoState({
      id: folderID,
      repoName: params.Repo,
      currBranchName: repoState.currBranchName,
      currCommitId:  commitId,
      currFolderPath: repoState.currFolderPath,
      folders: [],
      files: files,
      contributors: repoState.contributors,
    });


      console.log(result);
     } catch(e){
      setRepoState(null);
      console.log(e);
     }
    }

    check();
  }, []);



  if (!repoState) {
    return (
      <>
        <h1>
          404 error: You are in a repo that you should not have access
          to/doesn't exist.
        </h1>
        <Link to="/" className="ctgrey-button">
          {" "}
          Return to home screen.{" "}
        </Link>
      </>
    );
  }

  const contributorRows = [];
  Object.entries(repoState['contributors']).forEach(([key, value]) => {
    contributorRows.push((<tr><td>{key}</td> <td>{value}</td> </tr>));
  });

  return (
    <>
      <RepoHeader />
      <div>
      <div className="centerDiv">
        <h2>
          Repo <i>{repoState["repoName"]}</i>'s Home Page
        </h2>
        <h3>current branch: {repoState["currBranchName"]}</h3>
      </div>
      <div className="centerDiv">
        <h3> {repoState["currFolderPath"]} </h3>
        <h3> commitId: {repoState['currCommitId']}</h3>
      </div>
      <div className="centerDiv">
        <ul className='centerColDiv'>
          Folders and files
          {repoState["folders"].map(folder => <li className='ctgrey-li'><button onClick=''>{folder[1]}</button></li>)}
          {repoState["files"].map(file => <li className='ctgrey-li'><Link to={String(file[0])}>
                                          {String(file[1])}</Link></li>)}
        </ul>
        <div >
          <table border="1">
            <thead>
                <tr>
                    <th>Contributor Username</th>
                    <th>Permissions</th>
                </tr>
            </thead>
            <tbody>
            {contributorRows}
            </tbody>
          </table>
          <br/>
          <Link className='ctgrey-button' to='/Issues'>See issues for this Repo</Link>
        </div>
      </div>
      </div>
    </>
  );
}

export default RepoHome;
