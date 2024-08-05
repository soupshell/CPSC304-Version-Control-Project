import RepoHeader from "../components/RepoHeader";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFilesAndFolders, getRootFolderID, addFile, addFolder} from "../controller/controller";
import Modal from 'react-modal';

function RepoHome(props) {
  const params = useParams(); // access params.id
  const loggedInUser = sessionStorage.getItem("isVerified");
  const currentUserPassword = sessionStorage.getItem("password");

  const [popup, setPopUp] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("")
  const [folderName, setFolderName] = useState("");
  const [temp, setTemp] = useState(1);
  const [currentFolderID, setCurrentFolderID] = useState(null);
  const [currentPath, setCurrentPath] = useState("/");
  const [currentCommitId, setCurrentCommitID] = useState(0);

  const [repoState, setRepoState] = useState(
    {
      repoName: params.Repo,
      currBranchName: "main",
      folders: [],
      files: [],
      contributors: {username: "Edit", username2: "Owner" },
    }
  );

  async function check() {
    console.log(repoState);
try{
 var commitID;
 var folderID;
  if(currentFolderID === null){
     const auth = await getRootFolderID(loggedInUser,currentUserPassword, repoState.repoName, repoState.currBranchName);

     if(auth === false) {
     setRepoState(null);
     return;
   }
     
    setCurrentFolderID(auth.queryResult.rows[0][0]);
    setCurrentCommitID(auth.queryResult.rows[0][1]);

    folderID =  auth.queryResult.rows[0][0];
    commitID = auth.queryResult.rows[0][1];
    console.log(folderID);
  } else {
    folderID = currentFolderID;
    commitID = currentCommitId
  }

   console.log(folderID);
   const result = await getFilesAndFolders(loggedInUser,currentUserPassword, repoState.repoName, repoState.currBranchName, folderID);

   const files = result.queryResult.files.rows;
   const folders = result.queryResult.folders.rows;

   console.log("files", files);
   
   setRepoState({
     repoName: params.Repo,
     currBranchName: repoState.currBranchName,
     currCommitId:  commitID,
     folders: folders,
     files: files,
     contributors: repoState.contributors,
   });


     console.log(result);
    } catch(e){
     setRepoState(null);
     console.log(e);
    }
   }
  
  useEffect(() => {
    check();
  }, [temp]);



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
        <h3> {currentPath} </h3>
        <h3> commitId: {currentCommitId}</h3>
      </div>
      <div className="centerDiv">
        <ul className='centerColDiv'>
          Folders and files
          {repoState["folders"].map(folder => <li className='ctgrey-li'><button onClick= 
          {async () => {
            console.log("what", folder[0], folder[1]);
            setCurrentFolderID(folder[0]);
            setCurrentPath(folder[1]);
            setTemp(temp + 1);
          }}
          
          
          >{folder[1]}</button></li>)}
          {repoState["files"].map(file => <li className='ctgrey-li'><Link to={String(file[0])}>
          {String(file[1])}</Link></li>)}
        <button onClick={() => {
          setPopUp(true);
       }}> Commit a file </button>
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


<Modal isOpen={popup}
    contentLabel="Selected Option"
    ariaHideApp={false}
    transparent={true}
    >
       <div className="card-container" style = {{width: "80vw", height: "80vh"}}>      
      {<h1 >{"Add File"}</h1>}
      <form onSubmit={async (e) => { 
        e.preventDefault();
        console.log(fileName, fileContent, currentFolderID);
        const res = await addFile(loggedInUser, currentUserPassword, fileName, fileContent, repoState.currBranchName, currentFolderID, repoState.repoName);
        if(res === false){
          alert("file already exists!");
       } else {
         console.log(res);
         setCurrentFolderID(res.queryResult.rows[0][0]);
         setCurrentCommitID(res.queryResult.rows[0][1]);
         alert("file has been created");
       }
       setTemp(temp + 1);
      }}>
      <label> File name:
            <input type="text" id={'fileName'} onChange={
              (e) => {
                setFileName(e.target.value);
                e.preventDefault();
               }
            } required/>        
      </label>

      <label>File Content </label>
        <textarea
          style={{ minWidth: "500px", maxWidth: "1000px", height: "250px" }}
          onChange={(e) => {
           setFileContent(e.target.value);
          }}
          value={fileContent}
        ></textarea>
      <input type="submit" value="Submit"/>
      </form>



      {<h1 >{"Add Folder"}</h1>}
      <form onSubmit={async (e) => { 
       e.preventDefault()
       const res = await addFolder(loggedInUser, currentUserPassword, folderName, repoState.currBranchName, currentFolderID, repoState.repoName);
       if(res === false){
         alert("folder  already exists!");
      } else {
        console.log(res);
        setCurrentFolderID(res.queryResult.rows[0][0]);
        setCurrentCommitID(res.queryResult.rows[0][1]);
        alert("folder has been created");
      }
      setTemp(temp + 1);
      }}>
      <label> Folder name:
            <input type="text" id={'folderName'} onChange={
              (e) => {
                setFolderName(e.target.value);
                e.preventDefault();
               }
            } required/>        
      </label>
      <input type="submit" value="Submit"/>
      </form>
      <button style ={{width: "100px", height: "50px"}} onClick={(e) => {
        setPopUp(false);
      }}> Close </button>
    </div>


   </Modal>
    </>
  );
}

export default RepoHome;
