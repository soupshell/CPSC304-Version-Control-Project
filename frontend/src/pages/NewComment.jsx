import { useState } from 'react';
import { makeComment} from "../controller/controller";
import { useParams, Link } from "react-router-dom";


function NewComment(props) { 
    const {user, repo, issues} = useParams(); // access params.id

    return (
        <>
            //textbox with a submit button
            <Link className='ctgrey-button' to={`/${user}/${repo}/Issues/${issues}`}>Go back to issue</Link>
            <div className="card-container">      
                {title && <h1 >{title}</h1>}
                <p >{description}</p>
                <form onSubmit={async (e) => {
                    const commenttext = formValues['comment'];
                    const res = await makeComment(commenttext, user, new Date().toLocaleTimeString, issues);
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

export default NewComment;