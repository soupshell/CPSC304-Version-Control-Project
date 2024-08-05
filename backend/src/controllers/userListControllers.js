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

async function divisionPost(req, res) {
    try {
      const repoList = req.body.repoList;
      console.log(repoList);
      const repoListString = repoList.join(", ");

      if (repoListString) {
         res.status(400).send("No repos selected");
      }

      await oracle.withOracleDB(async (connection) => {
         // u1 is owner, u2 is current user
         const result = await connection.execute(`
            SELECT u2.username
            FROM Users2 u2
            WHERE NOT EXISTS
               ((SELECT id
               FROM UserContributesTo u_r1
               WHERE ID in (:listofRepoString))
               minus
               (SELECT u_r2.repoid
               FROM UserContributesTo u_r2
               WHERE u2.id = u_r2.userid))

            `, {listofRepoString: repoListString});

            console.log(result);
            res.json({queryResult: result});
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


async function query_AggNest(req, res) {
   try {
     await oracle.withOracleDB(async (connection) => {
        const result = await connection.execute(`
            select u2.username
            from Users2 u2
            where u2.dateJoined >= ALL (select dateJoined from Users2)
           `);

         console.log(result);
         return res.json(result);
     });
  } catch (e) {
     res.status(400).send(e.error);
  }
}


async function query_AggHav(req, res) {
   try {
      const minRepos = Math.max(1, req.body.minRepos);
      
      await oracle.withOracleDB(async (connection) => {
        const result = await connection.execute(`
            select u2.username, count(unique u_r.repoid) 
            from Users2 u2, UserContributesTo u_r 
            where u2.id = u_r.userid 
            group by u2.username 
            having count(unique u_r.repoid) >= :minRepos 
           `, {minRepos: minRepos});

           console.log(result);
           res.json(result);
     });
  } catch (e) {
     res.status(400).send(e.error);
  }
}

async function query_AggNorm(req, res) {
   try {
      await oracle.withOracleDB(async (connection) => {
        const result = await connection.execute(`
            select u2.username, count(unique u_r.repoid) as "Repo Count", listagg(r.name, ', ') as "Reponames"
            from Users2 u2
            left join UserContributesTo u_r
            on u2.id = u_r.userid 
            left join Repo r
            on u_r.repoid = r.id
            group by u2.username
         `);

         console.log(result);
         return res.json(result);
     });
  } catch (e) {
     res.status(400).send(e.error);
  }
}

module.exports = { testReactConnection, divisionGet, divisionPost, projectionPost, query_AggNest, query_AggHav, query_AggNorm};