import {useState, useEffect} from 'react';
import {postProjectionReq} from "../controller/controller";


function Projection(props) {
  const [selectedIds, setSelectedIds] = useState(["email", "id", "username", "datejoined" ]);
  const [projectionData, setProjectionData] = useState({headers: [], table: []});
  const handleCheckboxChange = (event) => {
      const checkedId = event.target.value;
      if(event.target.checked){
         setSelectedIds([...selectedIds,checkedId])
      }else{
         setSelectedIds(selectedIds.filter(id=>id !== checkedId))
      }
  }
   
  const handleSubmit = async (e) => {
      e.preventDefault();
      const res = await postProjectionReq(selectedIds);
      if(res === false) {
        setProjectionData([]);
        return;
      }
      setProjectionData(res);
  }
  
  const projectionHeaders = []
  const projectionTable = [];
  Object.entries(projectionData['headers']).forEach(([key, value]) => {
    projectionHeaders.push((<th>{value}</th>));
  });

  console.log(projectionData);

  for (let i=0;i<projectionData['table'].length; i++){
    let row = projectionData['table'][i];
    let tablerow=[];
    for (let j =0;j < row.length; j++) {
      tablerow.push((<td>{row[j]}</td>));
    }
    projectionTable.push((<tr>{tablerow}</tr>));
  }

   return (
      <div className="centerColDiv">
      <h2>Projection on Users</h2>
      <form className='checkboxList' onSubmit={(e) => handleSubmit(e)}>
        <table id="select which columns" border="1">
            <thead>
                <tr>
                    <th>
                      <label key={0}>
                      <input type="checkbox" value='id' onChange={(e) => handleCheckboxChange(e)} checked={selectedIds.includes('id')}/>
                      ID
                      </label>
                    </th>
                    <th>
                      <label key={1}>
                      <input type="checkbox" value='username' onChange={(e) => handleCheckboxChange(e)} checked={selectedIds.includes('username')}/>
                      username
                      </label>
                    </th>
                    <th>
                      <label key={2}>
                      <input type="checkbox" value='datejoined' onChange={(e) => handleCheckboxChange(e)} checked={selectedIds.includes('datejoined')}/>
                      dateJoined
                      </label>
                    </th>
                    <th>
                    <label key={3}>
                    <input type="checkbox" value='email'  onChange={(e) => handleCheckboxChange(e)} checked={selectedIds.includes('email')}/>
                    email
                    </label>
                    </th>
                    <th>
                      <input type="submit" value="Submit" />
                    </th>
                </tr>
            </thead>
        </table>
        <table id="projection-users" border="1">
          <tr>
          {projectionHeaders}
          </tr>
          {projectionTable}
        </table>
      </form>
      </div> 
   )
 }
 
 export default Projection;
 


