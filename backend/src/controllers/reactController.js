const express = require('express');
const oracle = require('./oracletest');

async function testReactConnection(req, res) {
   return res.json({ "message": "double quote from server!" });
}

module.exports = { testReactConnection};