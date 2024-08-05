import {useState} from 'react';

function Projection(props) {
  const [selectedIds, setSelectedIds] = useState([]);
   const handleCheckboxChange = (event) => {
      const checkedId = event.target.value;
      if(event.target.checked){
         setSelectedIds([...selectedIds,checkedId])
      }else{
         setSelectedIds(selectedIds.filter(id=>id !== checkedId))
      }
   }
   
   const handleSubmit = (e) => {
      e.preventDefault();
      console.log(selectedIds);
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
                      <input type="checkbox" value='id' onChange={(e) => handleCheckboxChange(e)}/>
                      ID
                      </label>
                    </th>
                    <th>
                      <label key={1}>
                      <input type="checkbox" value='username' onChange={(e) => handleCheckboxChange(e)}/>
                      username
                      </label>
                    </th>
                    <th>
                      <label key={2}>
                      <input type="checkbox" value='datejoined' onChange={(e) => handleCheckboxChange(e)}/>
                      dateJoined
                      </label>
                    </th>
                    <th>
                    <label key={3}>
                    <input type="checkbox" value='email'  onChange={(e) => handleCheckboxChange(e)}/>
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
        </table>
      </form>
      </div> 
   )
 }
 
 export default Projection;
 


