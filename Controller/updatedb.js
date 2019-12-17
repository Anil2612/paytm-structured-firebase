var route = require('express').Router();
var admin = require('firebase-admin');
var db = admin.firestore();
route.post('/transactionstorageapi', async (req, res) => {
    console.log('URL:',req.url);
    console.log("Request:", req.body);
    let date = new Date().toLocaleString();
    var transferdetails=req.body;
    req.body.transactiontimedate =  new Date().toLocaleString();
    req.body.transferamount = req.body.money;
    
    let jsonObj = req.body;
    delete jsonObj['money'];
    delete jsonObj['password'];
    console.log('transfer data is :', jsonObj);
    try {
        await db.collection('transaction-history').add(req.body);
        res.status(200).send({'message :' : "Inserted Data into trasaction storage"})
    } catch (error) {
        res.status(400).send({"message" : "Error Occured from DB"})
    }
  
   
});


module.exports = route;