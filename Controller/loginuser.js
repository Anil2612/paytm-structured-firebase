var route = require('express').Router();
var admin = require('firebase-admin');
var db = admin.firestore();
var checkuser = require('./helper/helper');
//Login to user
route.post('/login', async (req, res) => {
    return new Promise(async (resolve, reject) => {
        var loginuser = req.body;
        if (Number.isInteger(loginuser.mobilenumber) == false) {
            reject({ message: 'Wrong credentials', status: 'fail' });
        }
        let check = await checkuser.checkdocid(loginuser.mobilenumber);
        if (check) {
            let checkcred = await checkuser.checkcred(loginuser);
            console.log(checkcred);
            if (checkcred) {
                resolve({ message: 'Login successful', status: 'success' })
            }
            else {
                reject({ message: 'Login Unsuccessful', status: 'fail' })
            }
        }
        else {
            reject({ message: 'User not found', status: 'fail' });
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