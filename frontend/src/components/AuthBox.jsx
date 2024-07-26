import { useState } from 'react';

function AuthBox(props) {
   const title = props.title;
   const description = (title && title == 'Login') ? "For users with existing accounts" : "For first time users!";
   const handleSubmit = () => {
      console.log(title + " submitted.")
   };
   const [formValues, setFormValues] = useState({});
   const handleChange = (e) => {
    setFormValues({[e.target.id]:e.target.value});
    console.log(formValues); 
   }
   
   return (
   <div className="card-container">      
      {title && <h1 >{title}</h1>}
      <p >{description}</p>
      <form onSubmit={handleSubmit}>
      <label> Email:
        <input type="text" onChange={handleChange} />        
      </label>
      <label> Password:
        <input type="password" onChange={handleChange} />        
      </label>
      {title != 'Login' && 
          <label> Username:
            <input type="text" onChange={handleChange} />        
          </label>}
      <input type="submit" value="Submit" />
      </form>
    </div>
   )
 }
 
 export default AuthBox;
 