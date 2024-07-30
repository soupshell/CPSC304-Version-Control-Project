import React, { useState } from "react";
import { queryDB } from "../controller/controller";

function TesterPage(props) {
  const [testInput, setTestInput] = useState(` 
SELECT * 
FROM Repo r, UserContributesTo ru, Users2 u
WHERE r.id = ru.repoid 
AND ru.userid = u.id
    `);

  const [queryResult, setQueryResult] = useState([]);

  function mapResults(arr) {
    const newArr = arr.map((rowResults) => {
      const secondArr = rowResults.map((elem) => {
        return <p style={{ fontSize: "15px", padding: "10px" }}> {elem}</p>;
      });
      return <ul style={{ display: "flex" }}> {secondArr}</ul>;
    });

    return newArr;
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ display: "flex" }}>
        <label>Test SQL Input: </label>
        <textarea
          style={{ minWidth: "500px", maxWidth: "1000px", height: "250px" }}
          onChange={(val) => {
            setTestInput(val.target.value);
          }}
          value={testInput}
        ></textarea>
      </div>

      <div>
        <button
          onClick={async () => {
            console.log(testInput);
          const result = await queryDB(testInput);
            setQueryResult(result);
           
          }}
        >
          {" "}
          Send
        </button>
      </div>
      <ul> {mapResults(queryResult)}</ul>
    </div>
  );
}

export default TesterPage;
