var route = require('express').Router();
var admin = require('firebase-admin');
var db = admin.firestore();
var checkuser=require('./helper/helper');

route.post('/addmoney', async (req, res) => {
    new Promise(async (resolve, reject) => {
        var addmoney = req.body;
        var mobilenumber=JSON.stringify(addmoney.mobilenumber);
        if (Number.isInteger(addmoney.balance) == false || Number.isInteger(addmoney.mobilenumber) == false) {
            reject({ message: 'Wrong credentials or amount', status: 'fail' });
        }
        else{
            let checkid=await checkuser.checkdocid(addmoney.mobilenumber);
            if(checkid){
            let check=await checkuser.checkcred(addmoney);
            if( check &&  addmoney.balance > 0){
                let balance=await db.collection('user-registration').doc(mobilenumber).get().then((snapshot)=>{
                    return snapshot.data().balance;
                });
                let bal=balance+addmoney.balance;
                db.collection('user-registration').doc(mobilenumber).update({balance:bal});
                resolve({ message: 'Money added to valet', status: 'success' });
             
            }
            else{
                reject({ message: 'Money not added', status: 'fail' })
            }
        }
        else{
            reject({message:'Invalid input',status:'fail'})
        }
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