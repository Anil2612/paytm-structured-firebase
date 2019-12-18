const route = require('express').Router();
var admin = require("firebase-admin");
let db = admin.firestore();
var checkuser=require('./helper/helper');



route.post('/register', async (req, res) => {
    var user = req.body;
    var mobilenumber=JSON.stringify(user.mobilenumber);
    if(user.email==undefined){
        user.email='';
    }
    return new Promise(async (resolve, reject) => {
        var mno = JSON.stringify((user.mobilenumber)).length;
        var password = user.password;
        var pswd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        if (!password.match(pswd)) {
            return reject({ message: 'Password must have a number,a special character and min 7 characters', status: 'fail' });
        }
        if (!isNaN(user.mobilenumber) && (user.mobilenumber) > 0) {
            if (mno == 10) {
                if ((user.password).length > 0) {
                    let check=await checkuser.checkdocid(user.mobilenumber);
                    if(!check){
                        db.collection('user-registration').doc(mobilenumber).set({ 'mobilenumber': user.mobilenumber, 'password': user.password, 'email': user.email,'balance':0, 'active': false });
                        resolve({ message: 'Thank you for registering to paytm', status: 'success' })   
                    }
                    else{
                        reject({ message: 'Registration Failed due to duplicate entry', status: 'fail' });
                    }
                } else {
                    return reject({ message: 'Invalid password', status: 'fail' });
                }
            }
            else {
                return reject({
                    'message :': 'Mobile number should be 10 digit or invalid number'
                    , 'status': 'fail'
                });
            }
        } else {
            return reject({ message: 'Not a valid number', status: 'fail' });
        }
    })
        .then(resultData => {
            res.send(resultData);
        })
        .catch(err => {
            res.send(err);
        })
});

module.exports = route;
