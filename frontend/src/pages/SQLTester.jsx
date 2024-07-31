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
  const [colNames, setColNames] = useState([]);

  function mapResults(colNamesArr, resultArr) {
    const colNames = colNamesArr.map((elem) => {
      return <p style={{ fontSize: "15px", padding: "10px" }}> {elem.name}</p>;
    });

    const colNameList = [<ul style={{ display: "flex" }}> {colNames} </ul>];

    const resultList = resultArr.map((rowResults) => {
      const secondArr = rowResults.map((elem) => {
        return <p style={{ fontSize: "15px", padding: "10px" }}> {elem}</p>;
      });
      return <ul style={{ display: "flex" }}> {secondArr}</ul>;
    });

    return (
      <div>
        {" "}
        {colNameList} {resultList}
      </div>
    );
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
            const rows = result.rows;
            const colNames = result.metaData;
            
            if (rows){setQueryResult(rows);}
            if (colNames){ setColNames(colNames);}
          }}
        >
          {" "}
          Send
        </button>
      </div>
      <ul> {mapResults(colNames, queryResult)}</ul>
    </div>
  );
}

export default TesterPage;
