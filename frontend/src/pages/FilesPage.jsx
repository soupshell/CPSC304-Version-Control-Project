import React, { useEffect, useLayoutEffect } from "react";
import "../css/FilePage.css";
import { useState } from "react";
import ContributorTable from "../components/ContributorTable";
import { useParams, Link } from "react-router-dom";
import {userLogin, queryDB, getFileContent } from "../controller/controller";

const fileContent = "hello";

function FilePage(props) {
  const params = useParams();
  const pathUsername = params.User;
  const repoName = params.Repo;
  const fileID = params.FileID;
  const loggedInUser = sessionStorage.getItem("isVerified");
  const currentUserPassword = sessionStorage.getItem("password");
  const [access, setAccess] = useState({checkedAccess : false, hasAccess : false, fileExists: false});

  const [fileState, setFileData] = useState({
    contributors: {},
    repoName: "",
    fileName: "",
    fileID: "",
    createdOnDate: "",
    fileContent: "",
  });
  

  console.log(loggedInUser, currentUserPassword);

  useEffect(() => {
    async function check() {
      try {
        const auth = await getFileContent(loggedInUser, currentUserPassword, repoName, fileID);
        const access = auth.validLogin;
        const fileInfo = auth.queryResult;
        setAccess({checkedAccess: true, hasAccess: Boolean(access)});
        setFileData({
            contributors: { username1: "Edit", username2: "Owner" },
            repoName: params.Repo,
            fileName: "test file 1",
            fileID: params.File,
            createdOnDate: "june 1st 2024",
            fileContent: "",
          });
      } catch (e) {
        console.log(e);
      }
    }

    check();
  }, []);

  

  


  

  return (access.checkedAccess === false ?
     <div> </div>
    : (access.hasAccess === false ?
      <div>
      {" "}
      <p style={{ color: "grey", fontSize: "40px" }}>
        {" "}
        You dont have access to this content
      </p>{" "}
    </div> 
    :
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
            <p style={{ color: "white" }}>{fileState.fileContent}</p>
          </div>
        </div>
      </div>
      <div style={{ padding: "20px" }}>
        <ContributorTable contributors={fileState.contributors}>
          {" "}
        </ContributorTable>
      </div>
    </div>
    )
  );
}

export default FilePage;



   