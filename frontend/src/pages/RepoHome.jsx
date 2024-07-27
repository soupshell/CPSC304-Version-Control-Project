import RepoHeader from "../components/RepoHeader";
import {useParams, Link} from "react-router-dom";

function RepoHome(props) {
  const params = useParams();
  const max_repo_id = 2;
  
  if (params.id > max_repo_id) {
    return (
      <>
      <h1>404 error: You are in a repo that you should not have access to/doesn't exist.</h1>
      <Link to='/' className='ctgrey-button'> Return to home screen. </Link>
      </>
    );
  }

   return (
     <>
      <RepoHeader/>
      <p> Repo Home Page</p>
      <p>{params.id}</p>
     </>
   );
 }
 
 export default RepoHome;
 