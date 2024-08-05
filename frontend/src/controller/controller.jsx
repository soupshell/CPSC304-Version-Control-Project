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
  const request = reqPath.concat("login");
  try {
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password
      }),
    });

    if (!response.ok) {
      console.log(await response.text());
      return false;
    }
    
    const reqbody = await response.json()
    return reqbody.validLogin;
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

async function getRepos(username, password) {
  var request = reqPath.concat("getRepos");
  try {
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password
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


async function getFilesAndFolders(username, password, repoName, branchName, currentFolderID) {
  var request = reqPath.concat("getFilesAndFolders");
  try {
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        repoName: repoName,
        branchName: branchName,
        currentFolderID: currentFolderID
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


async function getRootFolderID(username, password, repoName, branchName) {
  var request = reqPath.concat("getRootFolderID");
  try {
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        repoName: repoName,
        branchName: branchName,
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

//for divisionGet
async function getUniversalRepos() {
  var request = reqPath.concat("divisionGet");
  try {
    const response = await fetch(request);

    if (!response.ok) {
      console.log(await response.text());
      return false;
    }
    
    const resJSON = await response.json()
    // console.log(resJSON);
    return resJSON;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function postProjectionReq(selectedIds) {
  var request = reqPath.concat("projection");
  try {
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({'selectedIds': selectedIds})
    });
    const resJSON = await response.json();
    return {headers: selectedIds, table: resJSON.rows};
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function postAggNormReq() {
  var request = reqPath.concat("AggNorm");
  try {
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({})
    });
    const resJSON = await response.json();
    return resJSON.rows;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function postAggNestReq() {
  var request = reqPath.concat("AggNest");
  try {
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({})
    });
    const resJSON = await response.json();
    return resJSON.rows;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function postAggHavReq(minRepos) {
  var request = reqPath.concat("AggHav");
  try {
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({'minRepos': minRepos})
    });
    const resJSON = await response.json();
    return resJSON.rows;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function postDivisionReq(repoList) {
  var request = reqPath.concat("divisionPost");
  try {
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({'repoList': repoList})
    });
    const resJSON = await response.json();
    return resJSON.rows;
  } catch (e) {
    console.log(e);
    return false;
  }
}


async function addFile(username, password, fileName, fileContent, branchName, parentFolderID, repoName) {
  var request = reqPath.concat("createFile");

  try {
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        repoName: repoName,
        branchName: branchName,
        fileName: fileName,
        fileContent: fileContent,
        parentFolderID: parentFolderID
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


async function addFolder(username, password, fileName, branchName, parentFolderID, repoName) {
  var request = reqPath.concat("createFolder");
  console.log(typeof(username), typeof(password), typeof(fileName), typeof(branchName), typeof(parentFolderID), typeof(repoName));
  console.log(request);
  try {
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        repoName: repoName,
        branchName: branchName,
        fileName: fileName,
        fileContent: "",
        parentFolderID: parentFolderID
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
};

async function getIssues(repo, filter) {
  var request = reqPath.concat("getIssues");
  try {
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repo: repo,
        filter: filter
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

export {userLogin, queryDB, userSignup, checkAccess, getFileContent, createRepo, getRepos, getFilesAndFolders, getRootFolderID, addFile, addFolder, 
        getUniversalRepos, postProjectionReq, postAggNormReq, postAggNestReq, postAggHavReq, postDivisionReq, 
        getIssues};

