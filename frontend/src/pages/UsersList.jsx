import Projection from '../components/Projection';
import AggNest from '../components/AggNest';
import AggHav from '../components/AggHav';
import AggNorm from '../components/AggNorm'
import Division from '../components/Division';
import { useEffect, useState } from 'react';
import {getUniversalRepos} from "../controller/controller.jsx"

function UsersList(props) {
  const [allRepos, setAllRepos] = useState([]);
  
  useEffect(() => {
    async function updateAllRepos() {
      const res = await getUniversalRepos();
      if(res === false) {
        setRepoState([]);
        return;
      }
      setAllRepos(res.rows);
    };
    updateAllRepos();
  }, []);

   return (
     <>
       <div className="centerDiv">
        <h1>Our Users</h1>
        <AggNest />
       </div>
       <br></br>
       <div className="centerDiv">
        <Projection />
        <AggNorm/>
        <AggHav />
       </div>

       <div className="centerDiv">
        <Division repolist={allRepos}/>
       </div>
     </>
   )
 }
 
 export default UsersList;
 