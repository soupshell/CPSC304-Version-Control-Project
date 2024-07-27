import HomeHeader from '../components/HomeHeader'

function Home(props) {
  const repos = [
    {'id': 1,
    'name': 'math-repo',
    'owner': 'owner-username',
    'latestCommitBranch': 'branchname',
    'latestCommitTime': '2024-07-07',
    'userPerm': 'Edit'
    },
    {'id': 2,
      'name': 'testrepo',
      'owner': 'owner-username',
      'latestCommitBranch': 'branchname',
      'latestCommitTime': '2024-07-21',
      'userPerm': 'Edit'
    }
  ];
  const listItems = repos.map(repo => <li>{repo.name}</li>);
  return (
    <>
     <HomeHeader/>
     <div className='repos-container'>
      <ul>{listItems}</ul>
     </div>

    </>
  )
}

export default Home;
