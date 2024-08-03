import {Link} from 'react-router-dom';

//EXAMPLE
// props.repo = {'id': 1,
//    'name': 'math-repo',
//    'owner': 'owner-username',
//    'latestCommitBranch': 'branchname',
//    'latestCommitTime': '2024-07-07',
//    'userPerm': 'Edit'
//    }

function RepoLinkBox(props) {
   const repo = props.repoInfo; 
   return (
     <Link to={'/' + repo['owner'] + '/' + repo['name']}>
      <div className='ctgrey-button'>
         <p>{repo['name']}</p>
         <p>{"Owner: " + repo['owner']}</p>
         <p> The last commit was on branch {repo['latestCommitBranch']}, {"at " + repo['latestCommitTime']} </p>
         <p>{"Permissions:" + repo['userPerm']}</p>
      </div>
     </Link>
   );
 }

export default RepoLinkBox;