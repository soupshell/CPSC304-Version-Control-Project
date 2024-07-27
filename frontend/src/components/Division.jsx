import {useState} from 'react';

function Division(props) {
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
      console.log(selectedIds);
   }
   
   const repos = [
      {
        id: "1",
        name: "Student",
      },{
         id: "2",
         name: "test",
       },{
         id: "3",
         name: "hey",
       },{
         id: "4",
         name: "sup",
       },{
         id: "5",
         name: "world",
       }
    ];

   const checkboxList = repos.map((repo, index) => (
      <label key={repo.id}>
        <input type="checkbox" value={repo.id} onChange={(e) => handleCheckboxChange(e)} />
        {repo.name}
      </label>
    ));


   return (
     <div className="divisionDivider">
      <form className='checkboxList' onSubmit={(e) => handleSubmit(e)}>
         <h3>Select Repos by name</h3>
         {checkboxList}      
         <input type="submit" value="Submit" />
      </form>
      
      <div className="centerColDiv">
      <h2>Users contributing to all selected Repos</h2>
        <table id="aggregation-nested" border="1">
            <thead>
                <tr>
                    <th>username</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
      </div>  
     </div>
    
   )
 }
 
 export default Division;
 