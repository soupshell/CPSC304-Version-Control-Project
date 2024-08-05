
import { useEffect, useState } from "react";
import {addUserToRepo, getContributors} from "../controller/controller";
import Modal from 'react-modal';

function ContributorTable(props) {
  const contributorRows = [];
  const loggedInUser = sessionStorage.getItem("isVerified");
  const currentUserPassword = sessionStorage.getItem("password");
  const repoName = props.repoName;
  const [formValues, setFormValues] = useState({});
  const [contributorNames, setContributorNames] = useState([]);
  const [popup, setPopUp] = useState(false);
  const [permissions, setPermissions] = useState("READ");

  const handleChange = (e) => {
    let temp = formValues
    temp[e.target.id] = e.target.value
    setFormValues(formValues);
    e.preventDefault();
   }

   async function check() {
    try {
      if(repoName){
       const contributors = await getContributors(repoName);
       console.log(contributors.queryResult.rows);
       setContributorNames(contributors.queryResult.rows);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    check();
  }, []);

  contributorNames.forEach((arr) => {
    contributorRows.push(
      <tr>
        <td>{arr[0]}</td> <td>{arr[1]}</td> <td>{arr[2]}</td>{" "}
      </tr>
    );
  });

  return (
    <div> 
    <table border="1">
      <thead>
        <tr>
          <th>Contributor Username</th>
          <th>Owner</th>
          <th>Permissions</th>
        </tr>
      </thead>
      <tbody>{contributorRows}</tbody>
      <button onClick={() => {
        setPopUp(true);
      }}> Add User to repo </button>
    </table>

<Modal isOpen={popup}
contentLabel="Selected Option"
ariaHideApp={false}
transparent={true}
>
   <div className="card-container" style = {{width: "80vw", height: "80vh"}}>      
  {<h1 >{"add user"}</h1>}
  <form onSubmit={async (e) => { 
     e.preventDefault();
     const userName = formValues['userName'];
     console.log(permissions);
     try{
     const result = await addUserToRepo(loggedInUser, currentUserPassword, repoName, userName, permissions);
     if(result === false){
      alert("user doenst exist or already added!");
   } else {
     console.log(result);
     alert("user has been added to repo");
     setPopUp(false);
     check();
   }
     console.log(result);
     } catch(e){
      console.log(e);
     }
  }}>
  <label> user to add:
        <input type="text" id={'userName'} onChange={handleChange} required/>        
  </label>
  <input type="submit" value="Submit"/>
  <label>
      Permissions:
      <select name="selectedFruit" defaultValue="READ" onChange={(e) => {setPermissions(e.target.value)}}>
        <option value="READ" > READ</option>
        <option value="WRITE" > WRITE</option>
      </select>
    </label>
  </form>
  <button style ={{width: "100px", height: "50px"}} onClick={(e) => {
    setPopUp(false);
  }}> Close </button>
</div>
</Modal>
</div>
  );
}


export default ContributorTable;