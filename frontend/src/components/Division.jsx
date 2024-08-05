import {useState} from 'react';
import {postDivisionReq} from "../controller/controller";

// const repos = [
//   [ 1, "NON REMOTE" ],
//    [ 2, "THIS IS NOT REMOTE" ],
//    [ 3, "react_app" ],
//    [ 4, "cat_repository" ],
//   [ 5, "cat_repository2" ]
//   ];
//props = {repolist=[list of repos]}
function Division(props) {
   const [selectedIds, setSelectedIds] = useState([]);
   const [usersFromDivision, setUsersFromDivision] = useState([]);
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
      const res = await postDivisionReq(selectedIds);
      if(res === false) {
         setUsersFromDivision([]);
         return;
       }
       setUsersFromDivision(res);
   }
   

   const checkboxList = [];
   props.repolist.forEach((repo) => checkboxList.push((
      <label key={repo[0]}>
        <input type="checkbox" value={repo[0]} onChange={(e) => handleCheckboxChange(e)} />
        {repo[1]}
      </label>
    )));


   const tableData = [];
   usersFromDivision.forEach((value, index) => {
      tableData.push(<tr><td>{value}</td></tr>)
   });

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
            {tableData}
            </tbody>
        </table>
      </div>  
     </div>
    
   )
 }
 
 export default Division;
 