import { useState } from 'react';

function AuthBox(props) {
   const title = props.title;
   const description = (title && title == 'Login') ? "For users with existing accounts" : "For first time users!";
   const handleSubmitLogin = (e) => {
      e.preventDefault();
      props.verifyFn(formValues);
   };
   const handleSubmitSignup =  (e) => {
     e.preventDefault();
     props.verifyFn(formValues);
   };
   const handleSubmit =  (title && title == 'Login') ? handleSubmitLogin : handleSubmitSignup; 
   const [formValues, setFormValues] = useState({});
   const handleChange = (e) => {
    let temp = formValues
    temp[e.target.id] = e.target.value
    setFormValues(formValues);
   }
   
   return (
   <div className="card-container">      
      {title && <h1 >{title}</h1>}
      <p >{description}</p>
      <form onSubmit={handleSubmit}>
      <label> Username:
            <input type="text" id={'username'} onChange={handleChange} required/>        
      </label>
      <label> Password:
        <input type="password" id={'pwd'} onChange={handleChange} required/>        
      </label>
      {title != 'Login' && 
        <label> Email:
          <input type="email" id={'email'} onChange={handleChange} required/>        
        </label>}
      <input type="submit" value="Submit" />
      </form>
    </div>
   )
 }
 
 export default AuthBox;
 