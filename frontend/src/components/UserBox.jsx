
function UserBox(props) {
   const user = sessionStorage.getItem('isVerified'); 
   
   return (
     <>
      <p> You are user: {user.email}</p>
     </>
   );
 }
 
 export default UserBox;
 