var app = require('express')();
var bodyparser = require('body-parser');
app.use(bodyparser.json());
//**********************************************************************************88 */
//firestore
var admin = require("firebase-admin");
var serviceAccount = require("./config/key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-node-1e514.firebaseio.com"
});




//**********************************************************************************88 */


var middleware=require('./Controller/middleware/database')

app.use(middleware);

var routes=require('./Router/routes');
app.use('/api',routes);


app.post('*', (req,res) => {
    res.status(404).send({message : 'Invalid Api Please check Api !!!!!!!!!!'})
})

app.all('/', (req,res) => {
    res.status(200).send({message : 'Api is Live !!!!!!'})
})

const port = process.env.PORT || 8080;
app.listen(port);

