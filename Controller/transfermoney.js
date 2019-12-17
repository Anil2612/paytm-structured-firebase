var route = require('express').Router();
var checkuser = require('./helper/helper');
var admin = require('firebase-admin');
var db = admin.firestore();
var request = require('request-promise');
var dbu=require('../Controller/updatedb');




//Money Transfer
route.post('/transfer', async (req, res) => {
    var transferdetails = req.body;
    return new Promise(async (resolve, reject) => {
        let checkfromid = await checkuser.checkdocid(transferdetails.fromuser);
        let checktoid = await checkuser.checkdocid(transferdetails.touser);
        if (checkfromid && checktoid) {
            let checkdetails = await checkuser.checktransferuserdetails(transferdetails);
            if (checkdetails) {
                let fromuser = JSON.stringify(transferdetails.fromuser);
                let touser = JSON.stringify(transferdetails.touser);
                let date = new Date().toLocaleString();
                let fbalance = await db.collection('user-registration').doc(fromuser).get().then((snapshot) => {
                    return snapshot.data().balance;
                });
                let tbalance = await db.collection('user-registration').doc(touser).get().then((snapshot) => {
                    return snapshot.data().balance;
                });
                db.collection('user-registration').doc(fromuser).update({ balance: fbalance - transferdetails.money })
                db.collection('user-registration').doc(touser).update({ balance: tbalance + transferdetails.money });

                /**
                 * @description create a Api that will store info into firestore
                 * call the created API from the code using (Request or https or axios module).
                 * check into the db success or fail
                 */


                const options = {
                    method: 'POST',
                    url: 'http://localhost:8080/api/user/transfer/transactionstorageapi',
                    body: req.body,
                    json: true
                }
                // request.post(options);
               await request(options, (err, res, body) => {
                    if (err) {
                        console.log("Error:", err);
                    }
                    else {
                        console.log('executing request module :',res.body);
                        // db.collection('transaction-history').add({ 'fromuser': transferdetails.fromuser, 'touser': transferdetails.touser, 'transactiontimedate': date, 'activity': 'credited', 'transferamount': transferdetails.money });
                    }
                });


                // db.collection('transaction-hist \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\               vry').add({ 'fromuser': transferdetails.fromuser, 'touser': transferdetails.touser, 'transactiontimedate': date, 'activity': 'credited', 'transferamount': transferdetails.money });              
                return resolve({ message: 'Transaction Successful', status: 'success' });
            }
            else {
                return reject({ message: 'Transaction Failed', status: 'fail' });
            }
        }
        else {
            reject({ message: 'User not found', status: 'fail' });
        }
    })
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            res.send(error);
        })
});
route.use('/transactionstorageapi',dbu);
module.exports = route;