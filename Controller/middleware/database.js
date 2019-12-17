var fs = require('fs');
var helper = require('../helper/helper');
var uflag = 0;
var aflag = 0;
var user = 0;
var i = 0;
var jsonObj = [];
var ajsonObj=[];
var admin = require('firebase-admin');
var db = admin.firestore();

module.exports = async (req, res, next) => {
    console.log('Req body:', req.body);
    let loginuser = req.body;
    let currenturl = req.url;
    console.log('current url:', currenturl);

    //Checking user or admin 
    var url = JSON.stringify(currenturl)
    if(url.includes('users')){
        next();
    }
    if (url.includes('admin')) {
        user = 1;
    }
    else {
        user = 0;
    }
    switch (user) {
        case 0:
            if(url.includes('register')){
                next();
            }
            let data;
            var mno = JSON.stringify(loginuser.mobilenumber);
            function uactivesql() {
                let c = helper.checkdocid(mno);
                if (c) {
                    db.collection('user-registration').doc(mno).update({ active: true });
                }
                else {
                    next();
                }
            }
            function uinactivesql() {
                let c = helper.checkdocid(mno);
                if (c) {
                    db.collection('user-registration').doc(mno).update({ active: false });
                }
                else {
                    next();
                }
            }
            var rslt = await function (lsuser) {
                return new Promise(async (resolve, reject) => {
                    console.log('Uurrent user(s):', lsuser);
                    let u = Number(lsuser);
                    console.log('Uurrent user(n):', u);
                    let c = await helper.checkdocid(u);
                    console.log("Checking in helper:", c);
                    if (c) {
                        db.collection('user-registration').doc(lsuser).get(u).then((snapshot) => {
                            resolve(snapshot.data().active);
                        })
                    }
                    else {
                        reject(2);
                    }
                })
                    .then((result) => {
                        return result;
                    })
                    .catch((err) => {
                        return err;
                    })
            }
            if (url.includes('transfer')) {
                let mobno = JSON.stringify(loginuser.fromuser);
                var active =await rslt(mobno);
                // console.log("Active transfer?:",active);
                if(active==true){
                    next();
                }
                else{
                    res.send({message:'Out of session',status:'fail'})
                }
            }
            if(url.includes('addmoney') || url.includes('transactionhistory')){
                let mobno = JSON.stringify(loginuser.mobilenumber);
                var active =await rslt(mobno);
                if(active==true){
                    next();
                }
                else{
                    res.send({message:'Out of session',status:'fail'})
                }
            }
           
            //For login user
            if (url.includes('login')) {
                function createJSON() {
                    var sessionID = (Math.random() * 100000);
                    sid = sessionID;
                    var mob = loginuser.mobilenumber;
                    var login = new Date().toLocaleString();
                    var logout = '';
                    item = {}
                    item["sessionid"] = sessionID;
                    item["mobilenumber"] = mob;
                    item["login"] = login;
                    item["logout"] = logout;
                    jsonObj[i++] = item;
                }

                let luser = req.body.mobilenumber;
                let lpassword = req.body.password;
                var lsuser = JSON.stringify(luser);
                var r;
                var rst = await rslt(lsuser);
                console.log(rst)
                if (rst != 2) {
                    db.collection('user-registration').doc(lsuser).get(luser).then((snapshot) => {
                        // console.log(snapshot);
                        if (snapshot.data().mobilenumber == luser && snapshot.data().password == lpassword) {
                            r = snapshot.data().active;
                            if (r == false) {
                                createJSON();
                                data = jsonObj;
                                fs.writeFileSync('user.json', JSON.stringify(data));
                                uactivesql();
                                next();
                            }
                            else {
                                console.log("Already Loginned");
                                next();
                            }
                        }
                        else {
                            console.log("Invalid username")
                            next();
                        }

                    });

                    if (res.statusCode == 401) {
                        uinactivesql();
                        next();
                    }
                }
                else {
                    next();
                }
            }


            //For logout user
            if (url.includes('logout')) {

                let luser = req.body.mobilenumber;
                let lpassword = req.body.password;
                let lsuser = JSON.stringify(luser);
                var r;

                result = await rslt(lsuser);
                console.log('Logout result:', result);
                if (result == 2) {
                    console.log({ message: 'Invalid credentials.', status: 'fail' });
                    next();
                }
                else {
                    db.collection('user-registration').doc(lsuser).get(luser).then((snapshot) => {
                        // console.log(snapshot);
                        if (snapshot.data().mobilenumber == luser && snapshot.data().password == lpassword) {
                            r = snapshot.data().active;
                            if (r == true) {
                                uinactivesql();
                                for (i = 0; i < jsonObj.length; i++) {
                                    if (luser == jsonObj[i].mobilenumber) {
                                        jsonObj[i].logout = new Date().toLocaleString();
                                    }
                                }
                                data = jsonObj;
                                fs.writeFileSync('user.json', JSON.stringify(data));
                                res.send({ message: 'Logout successful', status: 'success' });
                            }
                            else {
                                console.log("Already Loggedout");
                                res.send({ message: 'Already logged out', status: 'success' });
                            }
                        }
                        else {
                            console.log("Invalid username or password")
                            res.send({ message: 'Logout Unsuccessful', status: 'fail' })
                        }

                    });
                }
            }
          
            break;

        case 1:
            var mno = JSON.stringify(loginuser.mobilenumber);
            function aactivesql() {
                let c = helper.checkadmindocid(mno);
                console.log("active")
                if (c) {
                    db.collection('admin').doc(mno).update({ active: true });
                }
                else {
                    next();
                }
            }
            function ainactivesql() {
                let c = helper.checkadmindocid(mno);
                if (c) {
                    db.collection('admin').doc(mno).update({ active: false });
                }
                else {
                    next();
                }
            }
            var ruslt = await function (lsuser) {
                return new Promise(async (resolve, reject) => {
                    console.log('Uurrent user(s):', lsuser);
                    let u = Number(lsuser);
                    console.log('Uurrent user(n):', u);
                    let c = await helper.checkdocid(u);
                    console.log("Checking in helper:", c);
                    if (c) {
                        db.collection('admin').doc(lsuser).get(u).then((snapshot) => {
                            resolve(snapshot.data().active);
                        })
                    }
                    else {
                        reject(2);
                    }
                })
                    .then((result) => {
                        return result;
                    })
                    .catch((err) => {
                        return err;
                    })
            }
            
            if (url.includes('adminlogin')) {
                function createJSON() {
                    var sessionID = (Math.random() * 100000);
                    sid = sessionID;
                    var mob = loginuser.mobilenumber;
                    var login = new Date().toLocaleString();
                    var logout = '';
                    item = {}
                    item["sessionid"] = sessionID;
                    item["mobilenumber"] = mob;
                    item["login"] = login;
                    item["logout"] = logout;
                    ajsonObj[i++] = item;
                }

                let luser = req.body.mobilenumber;
                let lpassword = req.body.password;
                var lsuser = JSON.stringify(luser);
                var r;
                var rst = await ruslt(lsuser);
                console.log(rst)
                if (rst != 2) {
                    db.collection('admin').doc(lsuser).get(luser).then((snapshot) => {
                        // console.log(snapshot);
                        if (snapshot.data().mobilenumber == luser && snapshot.data().password == lpassword) {
                            r = snapshot.data().active;
                            if (r === false) {
                                createJSON();
                                d = ajsonObj;
                                fs.writeFileSync('admin.json', JSON.stringify(d));
                                aactivesql();
                                next();
                            }
                            else {
                                console.log("Already Loginned");
                                next();
                            }
                        }
                        else {
                            console.log("Invalid username")
                            next();
                        }

                    });

                    if (res.statusCode == 401) {
                        ainactivesql();
                        next();
                    }
                }
                else {
                    next();
                }
            }


            if(url.includes('showtransactions')){
                let mobno = JSON.stringify(loginuser.mobilenumber);
                var active =await ruslt(mobno);
                if(active==true){
                    next();
                }
                else{
                    res.send({message:'Out of session',status:'fail'})
                }
            }

            //For logout admin
            if (url.includes('logout')) {

                let luser = req.body.mobilenumber;
                let lpassword = req.body.password;
                let lsuser = JSON.stringify(luser);
                var r;

                result = await ruslt(lsuser);
                console.log('Logout result:', result);
                if (result == 2) {
                    console.log({ message: 'Invalid credentials.', status: 'fail' });
                    next();
                }
                else {
                    db.collection('admin').doc(lsuser).get(luser).then((snapshot) => {
                        // console.log(snapshot);
                        if (snapshot.data().mobilenumber == luser && snapshot.data().password == lpassword) {
                            r = snapshot.data().active;
                            if (r == true) {
                                ainactivesql();
                                for (i = 0; i < ajsonObj.length; i++) {
                                    if (luser == ajsonObj[i].mobilenumber) {
                                        ajsonObj[i].logout = new Date().toLocaleString();
                                    }
                                }
                                d = ajsonObj;
                                fs.writeFileSync('admin.json', JSON.stringify(d));
                                res.send({ message: 'Logout successful', status: 'success' });
                            }
                            else {
                                console.log("Already Loggedout");
                                res.send({ message: 'Already loggedout', status: 'success' });
                            }
                        }
                        else {
                            console.log("Invalid name or password")
                            res.send({ message: 'Logout Unsuccessful', status: 'fail' })
                        }

                    });
                }
            }
          
            break;
        default: next();
            break;
    }
    // }
    // else {
    //     res.send({ message: "Connection failed", status: "fail" });
    // }
    // });
}