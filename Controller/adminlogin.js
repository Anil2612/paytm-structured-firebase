const route = require('express').Router();
const admin = require('firebase-admin');
var db = admin.firestore();
var admincheck = require('./helper/helper');



//Admin login
route.post('/adminlogin', async (req, res) => {
    new Promise(async (resolve, reject) => {
        var loginadmin = req.body;
        if (Number.isInteger(loginadmin.mobilenumber) == false) {
            reject({ message: 'Admin login failed', status: 'fail' });
        }
        let check =await admincheck.checkadmindocid(loginadmin.mobilenumber)
        if (check) {
            let checkcred =await admincheck.checkcredadmin(loginadmin);
            if (checkcred) {
                resolve({ message: 'Admin login successful', status: 'success' });
            }
            else {
                res.status(401);
                reject({ message: 'Admin login failed', status: 'fail' });
            }
        }
        else {
            reject({ message: 'No Admin found', status: 'fail' });
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
