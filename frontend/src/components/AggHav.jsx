import {useState} from 'react';
import {postAggHavReq} from "../controller/controller";

function AggHav(props) {
  const [minRepos, setMinRepos] = useState(1);
  const [aggHavData, setAggHavData] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
      const res = await postAggHavReq(minRepos);
      if(res === false) {
        setAggHavData([]);
        return;
      }
      setAggHavData(res);
  }
  const handleChange = (e) => {
    let value = e.target.value
    if (value < 1) {
      value = 1
    }
    setMinRepos(value);
  }

  let  tableData = [];
  for (let i=0;i<aggHavData.length; i++){
    let row = aggHavData[i];
    let tablerow=[];
    for (let j =0;j < row.length; j++) {
      tablerow.push((<td>{row[j]}</td>));
    }
    tableData.push((<tr>{tablerow}</tr>));
  }

   return (
      <div className="centerColDiv">
      <h2>AggHav</h2>
      <form onSubmit={handleSubmit}>
      <label> Users with at least x Repos </label>
      <div className="centerDiv">
        <input type="number" value={minRepos} onChange={handleChange} />
        <input type="submit" value="Submit" />
      </div>
      </form>
        <table id="aggregation-having" border="1">
            <thead>
                <tr>
                <th>username</th>
                <th>RepoCount</th>
                </tr>
            </thead>
            <tbody>
            {tableData}
            </tbody>
        </table>
      </div> 
   )
 }
 
 export default AggHav;
 


