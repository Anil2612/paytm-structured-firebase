const express = require('express');
const route = express.Router();
var admin=require('firebase-admin');
var db=admin.firestore();
var checkuser=require('./helper/helper');



route.post('/logout',async (req, res) => {
    return new Promise(async (resolve, reject) => {
        var loginuser = req.body;
        var curl=JSON.stringify(req.url);
        if (Number.isInteger(loginuser.mobilenumber) == false) {
            reject({ message: 'Wrong credentials', status: 'fail' });
        }
        if(curl.includes('user')){
        var check = await checkuser.checkdocid(loginuser.mobilenumber);
        console.log("Inside check-user1:",check);
        }
        if(curl.includes('admin')){
        var check = await checkuser.checkadmindocid(loginuser.mobilenumber);
        console.log("Inside check-admin1:",check);
    }
        if (check) {
            console.log("Inside check:",check)
            if(curl.includes('user')){
            var checkcred = await checkuser.checkcred(loginuser);
            console.log("Inside check-user2:",check);
        }
            if(curl.includes('admin')){
            var checkcred = await checkuser.checkcredadmin(loginuser);
            console.log("Inside check-admin2:",check);
        }

           
            if (checkcred) {
                resolve({ message: 'Logout successful', status: 'success' })
            }
            else {
                console.log('Credential:',checkcred);
                reject({ message: 'Logout Unsuccessful', status: 'fail' })
            }
        }
        else {   
            console.log('Credential:',checkcred);        
            reject({ message: 'Logout Unsuccessful.', status: 'fail' })
        }
    })
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
});

module.exports = route;