import React from "react";


// have to change this everytime lol
const reqPath = "http://localhost:50005/";

async function testConnectionToBackend(str) {
  var request = reqPath.concat("testSQL");
  try {
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ string: str}),
    });

    const data = await response.json();
    console.log(data.rows);
    return data.rows;
  } catch(e){
    console.log(e);
    return [];
  }
}

export { testConnectionToBackend };
