import { useState } from 'react';
import HomeHeader from '../components/HomeHeader'
import RepoLinkBox from '../components/RepoLinkBox'
import Modal from 'react-modal';
import { createRepo, getRepos } from '../controller/controller';
import { useEffect } from 'react';

function Home(props) {

 const [popup, setPopUp] = useState(false);
 const [formValues, setFormValues] = useState({});
 const title = "Create a repo :";
 const loggedInUser = sessionStorage.getItem("isVerified");
 const currentUserPassword = sessionStorage.getItem("password");
 const [repos, setRepos] = useState([]);
 

 const handleChange = (e) => {
  let temp = formValues
  temp[e.target.id] = e.target.value
  setFormValues(formValues);
  e.preventDefault();
 }

 


  useEffect(() => {
    async function check() {
      try {
        const result = await getRepos(loggedInUser,currentUserPassword);
        if(result && result.queryResult && Array.isArray(result.queryResult.rows)){
          const repos = []
           result.queryResult.rows.forEach((row) => {
           const id = row[0];
           const  name = row[1];
           const owner =  row[2];
           const userPerm = row[3];
           const latestCommitBranch = row[4];
           const date = row[5];

           repos.push({'id': id,
            'name': name,
            'owner': owner,
            'latestCommitBranch': latestCommitBranch,
            'latestCommitTime': date,
            'userPerm': userPerm
          })
        });
          setRepos(repos);
          console.log(result.queryResult);
        }
      } catch (e) {
        console.log(e);
      }
    }

    check();
  }, []);


  const listItems = repos.map(repo => <li className='ctgrey-li'><RepoLinkBox repoInfo={repo} /></li>);
  return (
    <div> 
    <HomeHeader/>
     <div className='repos-container'>
      <h2>List of repos you can contribute to:</h2>
      <ul>{listItems}</ul>
      <button onClick={() => {
        setPopUp(true);
      }}> Add Repo </button>
     </div>
     <Modal isOpen={popup}
    contentLabel="Selected Option"
    ariaHideApp={false}
    transparent={true}
    >
       <div className="card-container" style = {{width: "80vw", height: "80vh"}}>      
      {title && <h1 >{title}</h1>}
      <form onSubmit={async (e) => { 
        const repoName = formValues['repoName'];
        const res = await createRepo(repoName,loggedInUser);
        console.log(res);
        e.preventDefault();

      }}>
      <label> Reponame:
            <input type="text" id={'repoName'} onChange={handleChange} required/>        
      </label>
      <input type="submit" value="Submit" />
      </form>
      <button style ={{width: "100px", height: "50px"}} onClick={(e) => {
        setPopUp(false);
      }}> Close </button>
    </div>
   </Modal>
    </div>
  )
}

export default Home;
