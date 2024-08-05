const express = require('express');
const oracle = require('./oracletest');

async function testReactConnection(req, res) {
   return res.json({ "message": "double quote from server!" });
}

async function divisionGet(req, res) {
   try {
      await oracle.withOracleDB(async (connection) => {
         const result = await connection.execute(`
         select id, name
         from Repo
         `, {});
         return res.json(result);
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
}


module.exports = { testReactConnection, divisionGet};