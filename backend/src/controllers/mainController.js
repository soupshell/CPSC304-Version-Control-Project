
const express = require('express');
const oracle = require('./oracletest')




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
      res.status(400).send("error");
   }

}


module.exports = { testFunction, testOracle,executeSQL };