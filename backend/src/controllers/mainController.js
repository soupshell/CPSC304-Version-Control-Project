
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

async function executeSQL(req, res) {
   try {
      await oracle.withOracleDB(async (connection) => {
         console.log(req.body);
         const result = await connection.execute(req.body.string);
         await connection.commit();
         res.json(result);
      });
   } catch (e) {
      console.log(e);
      res.status(400).send(e.error);
   }
}


async function checkUserHasAccessToFile(req, res) {
   const username = req.body.username;
   const password = req.body.password;
   try {
      await oracle.withOracleDB(async (connection) => {
         console.log(req.body);
         const result = await connection.execute(` `);
         res.json(result);
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
}

async function checkLogin(req, res) {
   try {
      const username = req.body.username;
      const password = req.body.password;

      console.log(username, password);

      if (username === null || password === null) {
         res.status(400).send("empty username or password");
      }

      await oracle.withOracleDB(async (connection) => {
         const result = await connection.execute(`
            SELECT hashPassword 
            FROM Users1 u1
            WHERE u1.email IN (SELECT email FROM Users2 u2 WHERE u2.username =  :username)`, { username: username });


           console.log(result);
         if (Array.isArray(result.rows) && result.rows.length > 0 &&
            Array.isArray(result.rows[0]) && result.rows[0].length > 0
            && result.rows[0][0] === password) {
            res.json({ validLogin: true });
         } else {
            if(Array.isArray(result.rows) && result.length > 0 &&
            Array.isArray(result.rows[0]) && result.rows[0].length > 0){
               console.log(result.rows[0][0], password);
            }
            res.status(400).send("INVALID PASSWORD");
         }
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
}


async function addUserToDB(req, res) {
   try {
      const username = req.body.username;
      const password = req.body.password;
      const email = req.body.email;
      const date = "2024/07/03"
    

      console.log(username, password, email);

      if (username === null || password === null || email === null) {
         res.status(400).send("empty username, password or email");
      }

      await oracle.withOracleDB(async (connection) => {
         const result = await connection.execute(`
      DECLARE
        v_count INTEGER;
      BEGIN
        SELECT COUNT(email) + 1 INTO v_count FROM Users1;
        INSERT INTO Users1(email, hashPassword) VALUES (:email, :password);
        INSERT INTO Users2(id, username, dateJoined, email) 
        VALUES (v_count, :username, TO_DATE(:date, 'yyyy/mm/dd'), :email);
        COMMIT;
      END;
            `, { username: username, password:password, email: email, date: date});

            console.log(result);
            res.json({ validLogin: true });
      });
   } catch (e) {
      res.status(400).send(e.error);
   }
}


module.exports = { checkLogin, testOracle, executeSQL, addUserToDB };