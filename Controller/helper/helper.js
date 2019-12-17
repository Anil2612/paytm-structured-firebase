var admin = require('firebase-admin')
var db = admin.firestore();


//Checking user document ID
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let checkdocid = (mobilenumber) => {
  return new Promise((resolve, reject) => {
    var mno = JSON.stringify(mobilenumber);
    const usersRef = db.collection('user-registration').doc(mno);
    usersRef.get().then((snapshot) => {
      if (snapshot.exists) {
        return resolve(true);
      }
      else {
        return reject(false);
      }
    });
  })
    .catch((err) => {
      return err;
    })
}
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



//Checking admin document ID
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let checkadmindocid = (mobilenumber) => {
  return new Promise((resolve, reject) => {
    var mno = JSON.stringify(mobilenumber);
    const usersRef = db.collection('admin').doc(mno);
    usersRef.get().then((snapshot) => {
      if (snapshot.exists) {
        return resolve(true);
      }
      else {
        return reject(false);
      }
    });
  })
    .catch((err) => {
      return err;
    })
}
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!





//Checking user transfer details
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let checktransferuserdetails = (reqbody) => {
  return new Promise((resolve, reject) => {
    let fromuser = JSON.stringify(reqbody.fromuser);
    if (Number.isInteger(reqbody.money) == true && Number.isInteger(reqbody.touser) == true && Number.isInteger(reqbody.fromuser) == true && reqbody.money > 0) {
      db.collection('user-registration').doc(fromuser).get().then((snapshot) => {
        if (snapshot.data().balance > 0 && snapshot.data().balance > reqbody.money && snapshot.data().password == reqbody.password) {
          return resolve(true);
        }
        else {
          return reject(false);
        }
      });
    }
    else {
      return reject(false);
    }
  })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    })
}
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


//Login User
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let checkcred = (loginuser) => {
  return new Promise((resolve, reject) => {
    // console.log(loginuser)
    let mno = JSON.stringify(loginuser.mobilenumber);
    // console.log(mno)
    db.collection('user-registration').doc(mno).get().then((snapshot) => {
      if (snapshot.data().mobilenumber == loginuser.mobilenumber && snapshot.data().password == loginuser.password) {
        return resolve(true);
      }
      else {
        return reject(false);
      }
    });
  })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    })
}
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



//Login Admin
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let checkcredadmin = (loginuser) => {
  return new Promise((resolve, reject) => {
    let mno = JSON.stringify(loginuser.mobilenumber);
    db.collection('admin').doc(mno).get().then((snapshot) => {
      if (snapshot.data().mobilenumber == loginuser.mobilenumber && snapshot.data().password == loginuser.password) {
        return resolve(true);
      }
      else {
        return reject(false);
      }
    });
  })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    })
}
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



module.exports.checkdocid = checkdocid;
module.exports.checkadmindocid=checkadmindocid;
module.exports.checktransferuserdetails = checktransferuserdetails;
module.exports.checkcred = checkcred;
module.exports.checkcredadmin=checkcredadmin;