import "../css/FilePage.css";
import { useState } from "react";
import ContributorTable from "../components/ContributorTable";

const fileContent = "hello";

function FilePage(props) {
  const username = "Username";

  const fileData = {
    contributors: {username: "Edit", username2: "Owner" },
    repoName: "Best project world",
    fileName : "file.txt",
    createdOnDate : "june 1st 2024"
  };

  const [fileState, setState] = useState(fileData);

    return (
      <div className="mainDiv">
        <div > 
        <div className="headerSection" style={{ alignItems: "center", backgroundColor: "white", padding: "1px" }}>
          <div className="filePage">
            <p style={{ color: "grey", fontSize: "40px" }}>{fileState.repoName}</p>
          </div>
        </div>
        <div className="fileContentPage">
          <div className="fileInfo" style={{ display: "flex", justifyContent: "flex-end" }}>
            <p style={{ color: "white", fontSize: "20px", paddingRight: "10vw" }}>{fileState.fileName}</p>
            <p style={{ color: "white", fontSize: "20px" }}>Created on: {fileState.createdOnDate}</p>
          </div>
          <div className="fileContent">
            <p style={{ color: "white" }}>{fileData.fileContent}</p>
          </div>
        </div>
        </div>
        <div style = {{padding: "20px"}}> 
          <ContributorTable contributors = {fileState.contributors} > </ContributorTable>
          </div>
      </div>
    );
}

export default FilePage;
