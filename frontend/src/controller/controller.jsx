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
      console.log(response);
      return [];
    }

    const data = await response.json();
    console.log(data.rows);
    return data.rows;
  } catch (e) {
    console.log(e);
    return [];
  }
}


async function login(username, password) {
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
      console.log(response);
      return false;
    }

    const data = await response.json();
    console.log(data);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}







export {login, queryDB };
