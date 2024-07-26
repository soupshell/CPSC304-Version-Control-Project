import AuthBox from '../components/AuthBox';

function Login(props) {

  return (
    
    <>
      <h1>Welcome to <i>your</i> Version Control</h1>
      <div className="centerDiv">
        <AuthBox title='Login'/>
        <p> -- or --</p>
        <AuthBox title='Signup'/>
      </div>
    </>
  );
}

export default Login;
