import Projection from '../components/Projection';
import AggNest from '../components/AggNest';
import AggHav from '../components/AggHav';
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
       <h1>Our Users</h1>
       <div className="centerDiv">
        <Projection />
        <AggNest />
        <AggHav />
       </div>

       <div className="centerDiv">
        <Division repolist={allRepos}/>
       </div>
     </>
   )
 }
 
 export default UsersList;
 