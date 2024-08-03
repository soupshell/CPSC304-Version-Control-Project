import { useState } from 'react';
import HomeHeader from '../components/HomeHeader'
import RepoLinkBox from '../components/RepoLinkBox'
import Modal from 'react-modal';
import { createRepo } from '../controller/controller';

function Home(props) {

 const [popup, setPopUp] = useState(false);
 const [formValues, setFormValues] = useState({});
 const title = "Create a repo :";
 const loggedInUser = sessionStorage.getItem("isVerified");
 

 const handleChange = (e) => {
  let temp = formValues
  temp[e.target.id] = e.target.value
  setFormValues(formValues);
  e.preventDefault();
 }

  const repos = [
    {'id': 1,
    'name': 'math-repo',
    'owner': 'owner-username',
    'latestCommitBranch': 'branchname',
    'latestCommitTime': '2024-07-07',
    'userPerm': 'Edit'
    },
    {'id': 2,
      'name': 'testrepo',
      'owner': 'owner-username',
      'latestCommitBranch': 'branchname',
      'latestCommitTime': '2024-07-21',
      'userPerm': 'Edit'
    }
  ];


  useEffect(() => {
    async function check() {
      try {
        // to do get all users repo's
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
