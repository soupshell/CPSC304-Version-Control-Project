import Projection from '../components/Projection';
import AggNest from '../components/AggNest';
import AggHav from '../components/AggHav';


function UsersList(props) {

   return (
     <>
       <h1>Our Users</h1>
       <div className="centerDiv">
        <Projection />
        <AggNest />
        <AggHav />
       </div>

       <div className="centerDiv">
        <div>
          <p>Select Repos</p>
          <p>Results</p>
        </div> 
       </div>
     </>
   )
 }
 
 export default UsersList;
 