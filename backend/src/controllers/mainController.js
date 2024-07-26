
const express = require('express');


async function testFunction(req,res){
    res.send({hello : "txt"});
}

module.exports = {testFunction};