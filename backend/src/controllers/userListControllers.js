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

async function projectionPost(req, res) {
   try {
      const ids = req.body.selectedIds;

      if (ids.length === 0) {
         return {};
      } 

      const columns_string = ids.join(', ');
      const query = 'SELECT ' + columns_string + ' from Users2';

      await oracle.withOracleDB(async (connection) => {
         const result = await connection.execute(query);
         
         return res.json(result);
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
}

module.exports = { testReactConnection, divisionGet, projectionPost};