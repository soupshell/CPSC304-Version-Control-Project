import React, { useState } from "react";
import { testConnectionToBackend } from "../controller/controller";

function TesterPage(props) {
  const [testInput, setTestInput] = useState("");
  const [queryResult, setQueryResult] = useState([]);

  function mapResults(arr) {
    
    const newArr = arr.map((rowResults) => {
      const secondArr = rowResults.map((elem) => {
        return <p style={{ fontSize: "25px", padding: "10px" }}> {elem}</p>;
      });
      return <ul style={{ display: "flex" }}> {secondArr}</ul>;
    });

    return newArr;
  }

  return (
    <div style={{ display: "flex" }}>
      <div>
        <label>
          Test SQL Input:{" "}
          <input
            name="myInput"
            style={{ width: "250px", height: "250px" }}
            onChange={(val) => {
              setTestInput(val.target.value);
            }}
          />
        </label>
      </div>

      <div>
        <button
          onClick={async () => {
            console.log(testInput);
            const result = await testConnectionToBackend(testInput);
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
