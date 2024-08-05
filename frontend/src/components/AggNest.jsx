import {useState, useEffect} from 'react';
import {postAggNestReq} from "../controller/controller";

function AggNest(props) {
  const [aggNestData, setAggNestData] = useState([]);
   
  useEffect(() => {
   async function getData() {
      const data = await postAggNestReq();
      setAggNestData(data[0]);
   }
   getData();
  }, []);

   return (
      <div className="centerColDiv">
      <h2>AggNest</h2>
      {aggNestData.length >= 2 && 
         <p>The most recently joined user is {aggNestData[0]} and their repo count is {aggNestData[1]}</p>}
      </div> 
   )
 }
 
 export default AggNest;
 


