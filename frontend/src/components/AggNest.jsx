import {useState, useEffect} from 'react';
import {postAggNestReq} from "../controller/controller";

function AggNest(props) {
  const [aggNestData, setAggNestData] = useState([]);
   
  useEffect(() => {
   async function getData() {
      const data = await postAggNestReq();
      setAggNestData(data);
   }
   getData();
  }, []);


   return (
      <div className="centerColDiv">
      <h2>AggNest</h2>
      <p>The most recently joined user is {aggNestData}</p>
      </div> 
   )
 }
 
 export default AggNest;
 


