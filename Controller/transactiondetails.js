const route = require('express').Router();
const admin=require('firebase-admin');
const db=admin.firestore();
var admincheck = require('./helper/helper');
var arr=[];
var i=0;

//Show all transaction details to admin
route.get('/showtransactions', async (req, res) => {
    return new Promise(async (resolve, reject) => {
        var tcredential = req.body;
       if (Number.isInteger(tcredential.mobilenumber) == false) {
          return reject({ message: 'Invalid credentials', status: 'fail' });
        }
            let check=await admincheck.checkadmindocid(tcredential.mobilenumber);
            if(check){
            let checkcred =await admincheck.checkcredadmin(tcredential);
            if (checkcred) {
                db.collection('transaction-history').get().then((snapshot)=>{
                    snapshot.docs.forEach(doc=>{
                        arr[i++]=doc.data();
                    })
                    resolve(arr);
                })
            }
            else {
                res.status(401);
               return reject({ message: 'Not an admin', status: 'fail' });
            }
        }
        else{
            return reject({ message: 'Not an admin', status: 'fail' });
        }
    })
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.send(err);
        })
});
module.exports = route;
