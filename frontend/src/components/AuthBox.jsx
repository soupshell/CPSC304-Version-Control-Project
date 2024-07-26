
function AuthBox(props) {
   const title = props.title;
   const description = 'this is login description';
   const buttonText = 'no link';
   const link = 'no';


   return (
   <div className="card-container">      
      {title && <h1 >{title}</h1>}
      {description && <p >{description}</p>}
      {buttonText && link && (
        <p>
          {buttonText}
        </p>
      )}
    </div>
   )
 }
 
 export default AuthBox;
 