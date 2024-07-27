
function AggHav(props) {
  //TODO handelSubmit and handleChange 
  const handleSubmit = (e) => {
    console.log('AGGHAV Called');
  }
  const handleChange = (e) => {

  }

   return (
      <div className="centerColDiv">
      <h2>AggHav</h2>
      <form onSubmit={handleSubmit}>
      <label> Users with at least x Repos </label>
      <div className="centerDiv">
        <input type="number" value='1' onChange={handleChange} />
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
 


