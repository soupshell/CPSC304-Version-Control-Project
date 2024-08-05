import Projection from '../components/Projection';
import AggNest from '../components/AggNest';
import AggHav from '../components/AggHav';
import Division from '../components/Division';


function UsersList(props) {
  
  
  useEffect(() => {

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
        <Division />
       </div>
     </>
   )
 }
 
 export default UsersList;
 