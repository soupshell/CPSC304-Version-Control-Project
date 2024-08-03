import React from "react";

// have to change this everytime lol
const reqPath = "http://localhost:59000/";

async function queryDB(str) {
  var request = reqPath.concat("testSQL");
  try {
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ string: str }),
    });

    if (!response.ok) {
      console.log(await response.text());
      return {};
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
    return {};
  }
}


async function userLogin(username, password) {
  var request = reqPath.concat("login");
  try {
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username,
        password: password
      }),
    });

    if (!response.ok) {
      console.log(await response.text());
      return false;
    }

    return (await response.json()).validLogin;
  } catch (e) {
    console.log(e);
    return false;
  }
}


async function userSignup(username, password, email) {
  var request = reqPath.concat("signup");
  try {
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username,
        password: password,
        email: email
      }),
    });

    if (!response.ok) {
      console.log(await response.text());
      return false;
    }

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}


async function checkAccess(username, password, repoName) {
  var request = reqPath.concat("hasAccess");
  try {
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username,
        password: password,
        repoName: repoName
      }),
    });

    if (!response.ok) {
      console.log(await response.text());
      return false;
    }

    return (await response.json()).validLogin;
  } catch (e) {
    console.log(e);
    return false;
  }
}


async function getFileContent(username, password, repoName, fileID) {
  var request = reqPath.concat("GetContent");
  try {
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username,
        password: password,
        repoName: repoName,
        fileID: fileID
      }),
    });

    if (!response.ok) {
      console.log(await response.text());
      return false;
    }
    
    const resJSON = await response.json()
    console.log(resJSON);
    return resJSON;
  } catch (e) {
    console.log(e);
    return false;
  }
}


async function createRepo(repoName, username) {
  var request = reqPath.concat("createRepo");
  try {
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repoName: repoName,
        username: username
      }),
    });

    if (!response.ok) {
      console.log(await response.text());
      return false;
    }
    
    const resJSON = await response.json()
    console.log(resJSON);
    return resJSON;
  } catch (e) {
    console.log(e);
    return false;
  }
}








export {userLogin, queryDB, userSignup, checkAccess, getFileContent, createRepo};
