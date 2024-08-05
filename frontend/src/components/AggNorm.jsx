import {useState, useEffect} from 'react';
import {postAggNormReq} from "../controller/controller";

function AggNorm(props) {
  const [aggNormData, setAggNormData] = useState([]);
   
  useEffect(() => {
   async function getData() {
      const data = await postAggNormReq();
      setAggNormData(data);
   }
   getData();
  }, []);

  let  tableData = [];
  console.log(aggNormData);
  for (let i=0;i<aggNormData.length; i++){
   let row = aggNormData[i];
   let tablerow=[];
   for (let j =0;j < row.length; j++) {
     tablerow.push((<td>{row[j]}</td>));
   }
   tableData.push((<tr>{tablerow}</tr>));
 }

   return (
      <div className="centerColDiv">
      <h2>AggNorm</h2>
        <table id="aggregation-norm" border="1">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>RepoCount</th>
                    <th>Repo Names</th>
                </tr>
            </thead>
            <tbody>
            {tableData}
            </tbody>
        </table>
      </div> 
   )
 }
 
 export default AggNorm;
 


