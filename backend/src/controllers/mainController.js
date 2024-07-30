
const express = require('express');
const oracle = require('./oracletest')
var currentUser = {username : "", password : ""}

async function testOracle(req, res) {
   try {
      const result = await oracle.testOracleConnection();
      if (result) {
         return res.send("success");
      } else {
         return 
      }
   } catch (error) {
      console.log(error);
      return res.status(400).send("failure");
   }
}

async function testFunction(req, res) {
   try {
      await oracle.withOracleDB(async (connection) => {
         const result = await connection.execute(`SELECT numberOfFiles 
         FROM Folders`);
         res.send(result);
      });
   } catch (e) {
      res.status(400).send("error");
   }

}

async function executeSQL(req, res) {
   try {
      await oracle.withOracleDB(async (connection) => {
         console.log(req.body);
         const result = await connection.execute(req.body.string);
         res.json(result);
      });
   } catch (e) {
      console.log(e);
      res.status(400).send(e.error);
   }
}


async function checkUserHasAccessToFile(req,res){
   try {
      await oracle.withOracleDB(async (connection) => {
         console.log(req.body);
         const result = await connection.execute(`
            
            
      `);
         res.json(result);
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
}

async function checkLogin(req, res){
   try {
      const username = req.body.username;
      const password = req.body.password;
      
      if(username === null ||  password === null){
         res.status(400).send("empty username or password");
      }
         console.log(req.body.username);
         console.log(req.body.password);
       

      await oracle.withOracleDB(async (connection) => {
         res.json({validLogin: true});
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
}


module.exports = {checkLogin, testFunction, testOracle,executeSQL };