import { useState } from 'react';
import { updateComment, getComment} from "../controller/controller";
import { useParams, Link } from "react-router-dom";
import { useEffect } from 'react';


function UpdateComment(props) { 
    const {user, reponame, issueid, commentid} = useParams(); // access params.id

    const [userid, setUserID] = useState(null);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");

    const loggedInUser = sessionStorage.getItem("isVerified");

    async function fetchComment() {
        try {
          const result = await getComment(commentid);
          if(result && result.queryResult && Array.isArray(result.queryResult.rows)){
            //const issues = []
             result.queryResult.rows.forEach((row) => {
             setUserID(row[0]);
             setMessage(row[1]);
             setUsername(row[2]);
          });
            //console.log(result.queryResult);
          }
        } catch (e) {
          console.log(e);
        }
      }

      useEffect(() => {
        fetchComment();
      }, []);

    if (loggedInUser != username) {
      return (
      <>
        <h1>
          You do not have permission to edit this comment
        </h1>
        <Link className='ctgrey-button' to={`/${user}/${repo}/Issues/${issues}`}>Go back to comments</Link>
      </>
      );
    }

    return (
        <>
            <div className="centerDiv">
              <div>Previously, the comment was:</div>
              <div>{message}</div>
            </div>

            <Link className='ctgrey-button' to={`/${user}/${repo}/Issues/${issues}`}>Go back to issue</Link>
            <div className="card-container">      
                {title && <h1 >{title}</h1>}
                <p >{description}</p>
                <form onSubmit={async (e) => {
                    const commenttext = formValues['comment'];
                    const res = await updateComment(commenttext, commentid);
                    alert("comment added successfully!");
                }}>
                    <label> Comment:
                        <input type="text" id={'comment'} onChange={handleChange} required/>        
                    </label>

                    <input type="submit" value="Submit" />
                </form>
            </div>
        </>
    );
}

export default UpdateComment;