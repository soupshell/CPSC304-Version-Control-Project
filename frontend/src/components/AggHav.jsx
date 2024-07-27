import {useState} from 'react';

function AggHav(props) {
  const [minRepos, setMinRepos] = useState(0);
  //TODO handelSubmit and handleChange 
  const handleSubmit = (e) => {
    console.log(minRepos);
    console.log('AGGHAV Called: ' + minRepos.toString() + ' is value of minRepos');
  }
  const handleChange = (e) => {
    setMinRepos(e.target.value);
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
            </tbody>
        </table>
      </div> 
   )
 }
 
 export default AggHav;
 


