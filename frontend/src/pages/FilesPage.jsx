import React, { useEffect, useLayoutEffect } from "react";
import "../css/FilePage.css";
import { useState } from "react";
import ContributorTable from "../components/ContributorTable";
import { useParams, Link } from "react-router-dom";
import { login, queryDB } from "../controller/controller";

const fileContent = "hello";

function FilePage(props) {
  const params = useParams();
  const pathUsername = params.User;
  const repoName = params.repo;
  const loggedInUser = sessionStorage.getItem("isVerified");
  const [hasAccess, setHasAccess] = useState(false);
  const [checkAccess, setCheckAccess] = useState(false);

  console.log(loggedInUser);

  useLayoutEffect(() => {
    // whole check should be done on backend
    async function checkAccess() {
      
      console.log("logging in");
      await login(loggedInUser, "1234");

      setHasAccess(true);
      setCheckAccess(true);

      // setTimeout(() => {
      //   setHasAccess(true);
      //   setCheckAccess(true);
      // }, 2000);
    }

    checkAccess();
  }, []);

  const fileData = {
    contributors: { username: "Edit", username2: "Owner" },
    repoName: params.Repo,
    fileName: "test file 1",
    fileID: params.File,
    createdOnDate: "june 1st 2024",
    fileContent: "helloooo",
  };

  const [fileState, setState] = useState(fileData);

  if (checkAccess === false) {
    return <div> </div>;
  } else if (hasAccess === false) {
    return (
      <div>
        {" "}
        <p style={{ color: "grey", fontSize: "40px" }}>
          {" "}
          You dont have access to this content
        </p>{" "}
      </div>
    );
  }

  return (
    <div className="mainDiv">
      <div>
        <div
          className="headerSection"
          style={{
            alignItems: "center",
            backgroundColor: "white",
            padding: "1px",
          }}
        >
          <div className="filePage">
            <p style={{ color: "grey", fontSize: "40px" }}>
              {fileState.repoName}
            </p>
          </div>
        </div>
        <div className="fileContentPage">
          <div
            className="fileInfo"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <p
              style={{ color: "white", fontSize: "20px", paddingRight: "10vw" }}
            >
              {fileState.fileName}
            </p>
            <p style={{ color: "white", fontSize: "20px" }}>
              Created on: {fileState.createdOnDate}
            </p>
          </div>
          <div className="fileContent">
            <p style={{ color: "white" }}>{fileData.fileContent}</p>
          </div>
        </div>
      </div>
      <div style={{ padding: "20px" }}>
        <ContributorTable contributors={fileState.contributors}>
          {" "}
        </ContributorTable>
      </div>
    </div>
  );
}

export default FilePage;
