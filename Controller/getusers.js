const express = require('express');
const route = express.Router();
// const mysqlConnection = require('../config/config-sql-connection');


//Displaying the users
var i = 0;
var users = [];
var admin = require("firebase-admin");
let db = admin.firestore();

db.collection('user-registration').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        // console.log(doc.data());
        users[i++] = doc.data();
    });
});



route.get('/users', (req, res) => {
    new Promise((resolve, reject) => {
        // var sql = `select * from users`;
        // mysqlConnection.query(sql, (err, row) => {
        if (users !== 'undefined') {
            resolve({ message: 'Users Displayed', status: 'success' });
            // sqlresult=row;
        }
        else {
            reject({ message: 'Users not displayed', status: 'fail' });
        }
        // });
    })
        .then(result => {
            res.send(users);
        })
        .catch(err => {
            res.send(err);
        });
});

module.exports = route;