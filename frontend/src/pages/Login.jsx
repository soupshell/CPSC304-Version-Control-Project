import AuthBox from '../components/AuthBox';
import {Link} from 'react-router-dom';

function Login(props) {
  return (
    <>
      <h1>Welcome to <i>your</i> Version Control</h1>
      <div className="centerDiv">
        <AuthBox title='Login' verifyFn={props.verifyFn} />
        <p> -- or --</p>
        <AuthBox title='Signup' verifyFn={props.signupFn}/>
      </div>
      <div className="centerDiv">
        <Link to='/UsersList' className="ctgrey-button"> See our users </Link>
      </div>
    </>
  );
}

export default Login;
