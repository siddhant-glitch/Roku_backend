const express = require('express');
const router = express.Router();
const config = require('../config.js');
const sql = require('mysql');

//middelware to protect username and password from url link
router.use(express.json());
router.use(express.urlencoded({ 'extended' : false }));

let pool = sql.createPool({
    connectionLimit: 20,
    host     : config.host,
    user     : config.user,
    password : config.password,
    database : config.database,
    port: 3306
  });

router.post('/getone', (req, res) => {
    // console.log(` hit the user route, the user is ${req.params.user}`);
    // res.end('done');
 
    pool.getConnection((err, connection) => {
        if (err) throw err;

        let currentUser = req.body;
            loginResult = {};

        let query = `SELECT first_name, password, FROM user WHERE first_name="${currentUser.username}"`;
        connection.query(query, (err, user) => {
            connection.release();

            if (err) throw err;

            // console.log(user);

            //checking if the user exists
            if(!user[0]) {
                loginResult.action = "add";
                // if it does, check psswrd
            } else if (user[0].password !== currentUser.password) {
                loginResult.field= 'password';
                loginResult.action = 'retry';
            } else {
                loginResult.message = 'authenticated';
            }

            // send back the login result - pass or fail
            res.json(loginResult);
        })
    })

})  // api/users/getone/Sid  


router.post('/signup', (req, res) => {
    console.log('hit add user route');

    let user = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err;

        let query = `INSERT INTO user(first_name, last_name, password, role, permissions, avatar) VALUES('${user.username}', 'Roku', '${user.password}', 0, 3, '')`;

        connection.query(query, (err, result) => {
            connection.release();

            if (err) throw err;

            console.log(result);

            res.json({action: 'added'});
        })
    })
})


router.get('/getall', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;

        connection.query('SELECT * FROM user', function (error, results) {
            connection.release();

            if (error) throw error;

            //removing passwords from the db results
            results.forEach(result => {
                delete result.password;
                delete result.last_name;

                if (!result.avatar) {
                    result.avatar = "temp_avatar.jpg";
                }
            })

            console.log(results);
            res.json(results);

            })

    })

})

module.exports = router;