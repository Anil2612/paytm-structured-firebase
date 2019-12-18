const route=require('express').Router();

 // All requied file will be configured below.

var getusers=require('../Controller/getusers');
var registerusers=require('../Controller/userregistration');
var loginuser=require('../Controller/loginuser');
var addmoney=require('../Controller/addmoney');
var transfermoney=require('../Controller/transfermoney');
var thistory=require('../Controller/showtransactionhistory');
var adminlogin=require('../Controller/adminlogin');
var tdetails=require('../Controller/transactiondetails');
var dbu=require('../Controller/updatedb');
var logout=require('../Controller/logout');


 // All Controllers will be called from below lines.

route.use('/users',getusers);
route.use('/user',registerusers);
route.use('/user',loginuser);
route.use('/user',addmoney);
route.use('/user',transfermoney);
route.use('/user',thistory);
route.use('/user/transfer',dbu);
route.use('/user',logout);
route.use('/admin',adminlogin);
route.use('/admin',tdetails);
route.use('/admin',logout);


module.exports=route;
