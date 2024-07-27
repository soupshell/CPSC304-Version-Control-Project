import RepoHeader from "../components/RepoHeader";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";

function RepoHome(props) {
  const params = useParams(); // access params.id
  //TODO THIS IS THE EXAMPLE REPODATA- should be async query in live
  const repoData = {
    id: 1,
    repoName: "testRepoName",
    currBranchName: "branchName",
    currCommitId: "123",
    currFolderPath: "/",
    folders: [{ filepath: "/folder1", fileId: "12" }],
    files: [
      { filepath: "/file1.txt", fileId: "3" },
      { filepath: "/file2.cpp", fileId: "3" },
    ],
    contributors: [{ username: "Edit", username2: "Owner" }],
  };
  const [repoState, setState] = useState(repoData);
  if (!repoData) {
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

  return (
    <>
      <RepoHeader />
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
        <p>Folders and files</p>
        <div>
          <p>Contributors</p>
          <p>issues Button</p>
        </div>
      </div>
    </>
  );
}

export default RepoHome;
