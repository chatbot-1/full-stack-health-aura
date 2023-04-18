const mongoose = require('mongoose');
const express = require("express");
const cors = require("cors");
const router = require('./router/auth');
const app = express();
const dotenv = require('dotenv');
const cookieparser = require("cookie-parser");
const twilio = require('twilio');

const accountSid = 'AC5cc235a746bee35669088ca325568928';
const authToken = '186d1bb1dc282d66adbd24f0f6dd21fb';
const client = new twilio(accountSid, authToken);

dotenv.config({path:'./config.env'});

const DB = process.env.DATABASE;

const middleware =(req,res,next) =>{
  console.log("hello");
  
}
middleware();

require('./db/conn');
app.use(cookieparser());
 
app.use(express.json());

app.use(require('./router/auth'));


//const User = require('./model/userSchema');

app.use(cors());
app.use(express.json());

app.get("/message", middleware,(req, res) => {
  res.json({ message: "Hello from server!" });
});
app.get('/send-text',(req,res)=>{
  const {recipient, textmessage} = req.query
  client.messages.create({
    body: textmessage,
    to: "+91"+recipient,
    from: '+16202981949'
  }).then((message) => console.log(message.body));
})

app.listen(5001, () => {
  console.log(`Server is running on port 5000.`);
});

module.exports = router;