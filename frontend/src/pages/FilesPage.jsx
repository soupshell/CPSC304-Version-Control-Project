import React, { useEffect, useLayoutEffect } from "react";
import "../css/FilePage.css";
import { useState } from "react";
import ContributorTable from "../components/ContributorTable";
import { useParams, Link } from "react-router-dom";
import {userLogin, queryDB, getFileContent } from "../controller/controller";
import NoAccessPage from "../components/NoAccessPage"

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
        console.log(fileInfo);
        setAccess({checkedAccess: true, hasAccess: Boolean(access)});
        
        if(access && fileContent){

        const fileContent = fileInfo.rows[0][0];
        const path = fileInfo.rows[0][1];
        const date = fileInfo.rows[0][2];

        console.log(fileContent,path,date);

        setFileData({
            contributors: { username1: "Edit", username2: "Owner" },
            repoName: params.Repo,
            fileName: path,
            fileID: params.File,
            createdOnDate: date,
            fileContent: fileContent,
          });
        }
      } catch (e) {
        console.log(e);
      }
    }

    check();
  }, []);

  return (access.checkedAccess === false ?
     <div> </div>
    : (access.hasAccess === false ?
      <NoAccessPage> </NoAccessPage>
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
        <ContributorTable repoName={repoName}> </ContributorTable>
      </div>
    </div>
    )
  );
}

export default FilePage;



   