
function UserBox(props) {
   const user = sessionStorage.getItem('isVerified'); 
   
   return (
     <>
      <p> You are logged in as: {user}</p>
     </>
   );
 }
 
 export default UserBox;
 