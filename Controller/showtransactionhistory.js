const route = require('express').Router();
var admin=require('firebase-admin');
var db=admin.firestore();
var checkuser=require('./helper/helper');
var arr=[];
var i=0;
//Show transaction history
route.get('/transactionhistory', (req, res) => {
    new Promise(async (resolve, reject) => {
        i=0;
        var t_history = req.body;
        if(Number.isInteger(t_history.mobilenumber)==false){
            reject({ message: 'Wrong credentials or amount',status:'fail' });
        } 
        let checkid=await checkuser.checkdocid(t_history.mobilenumber);
        console.log(t_history.mobilenumber);
        if(checkid){
           await db.collection('transaction-history').get().then((snapshot)=>{
                snapshot.docs.forEach(doc=>{
                    if(doc.data().fromuser==t_history.mobilenumber){
                        arr[i++]=doc.data();
                    }
                })
            })
            resolve(arr);
        }
        else{
            resolve({ message: 'Invalid Input', status: 'fail' });
        }
    })
        .then(result => {
            if(arr==''){
                res.send({message:'No Transactions yet',status:'success'});
            }
            else{
                res.send(result);
                arr=[];
            }
        })
        .catch(err => {
            res.send(err);
        })
});
module.exports = route;
