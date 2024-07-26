import { useState } from 'react';

function AuthBox(props) {
   const title = props.title;
   const description = (title && title == 'Login') ? "For users with existing accounts" : "For first time users!";
   const handleSubmit = () => {
      console.log(title + " submitted.")
      console.log()
   };
   const [formValues, setFormValues] = useState({});
   const handleChange = (e) => {
    let temp = formValues
    temp[e.target.id] = e.target.value
    setFormValues(formValues);
    console.log(formValues); 
   }
   
   return (
   <div className="card-container">      
      {title && <h1 >{title}</h1>}
      <p >{description}</p>
      <form onSubmit={handleSubmit}>
      <label> Email:
        <input type="text" id={title +'-email'} onChange={handleChange} required/>        
      </label>
      <label> Password:
        <input type="password" id={title +'-pwd'} onChange={handleChange} required/>        
      </label>
      {title != 'Login' && 
          <label> Username:
            <input type="text" id={title +'-username'} onChange={handleChange} required/>        
          </label>}
      <input type="submit" value="Submit" />
      </form>
    </div>
   )
 }
 
 export default AuthBox;
 