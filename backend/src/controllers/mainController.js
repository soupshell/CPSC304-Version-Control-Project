
const express = require('express');
const oracletest = require('./oracletest')

async function testFunction(req,res){
   await oracletest.testOracleConnection();
   res.send({hello : "txt"});
}

module.exports = {testFunction};