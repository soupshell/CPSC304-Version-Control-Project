import { useState } from 'react';
import { makeIssue} from "../controller/controller";
import { useParams, Link } from "react-router-dom";


function NewIssue(props) { 
    const {user, repo} = useParams(); // access params.id

    return (
        <>
            //textbox with a submit button
            <Link className='ctgrey-button' to={`/${user}/${repo}/Issues`}>Go back to issues</Link>
            <div className="card-container">      
                {title && <h1 >{title}</h1>}
                <p >{description}</p>
                <form onSubmit={async (e) => {
                    const issuetext = formValues['issue'];
                    const res = await makeIssue(issuetext, repo);
                    alert("issue added successfully!");
                }}>
                    <label> Issue:
                        <input type="text" id={'issue'} onChange={handleChange} required/>        
                    </label>

                    <input type="submit" value="Submit" />
                </form>
            </div>
        </>
    );
}

export default NewIssue;