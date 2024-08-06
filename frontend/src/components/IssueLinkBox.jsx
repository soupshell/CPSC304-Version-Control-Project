import {Link} from 'react-router-dom';

//EXAMPLE
// issue = {id: 1,
//          description: '123456789 123456789 123456789 123456789 1234567890',
//          dateResolved: '12-31-2023',
//          repoID: 1 }


function IssueLinkBox(props) {
   const issue = props.issueInfo; 
   
   return (
     <Link to= {'' + issue.id}>
      <div className='ctgrey-button'>
         <p>{issue['description']}</p>
         <p>{issue['dateResolved']}</p>
      </div>
     </Link>
   );
 }

export default IssueLinkBox;