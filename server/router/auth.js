const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require("../middleware/authenticate");



require("../db/conn");



const User = require("../model/userSchema");


//login route
router.post('/logup', async (req, res) => {

    try {
        let token;
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "filled the data" })
        }

        const userLogin = await User.findOne({ email: email });
      

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            

            token = await userLogin.generateAuthToken(); 
            console.log(token);
            //deleting token after a interval of time
            res.cookie("jwtoken",token, {
                expires :new Date(Date.now() +25892000000),
                httpOnly:true
            }) ;

            if (!isMatch) {
                res.status(400).json({error:'invalid credintaials'});
               
            }
            else {
                res.json({message:"success"})
            }
        }
        
        else {
            res.status(400).json({error:"invalid"});
        }

    } catch (error) {
        console.log(error);
    }
})
router.post('/signin', async (req, res) => {
    const { firstname, lastname ,email, password, cpassword } = req.body;
    if (!firstname ||!lastname ||!email || !password || !cpassword) {
        return res.status(422).json({ error: "plz fill" });
    }
    try {
        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "already exist" });

        }
        else if (password != cpassword) {
            return res.status(422).json({ error: "password are not matching" });
        }
        else {
            const user = new User({firstname, lastname, email, password, cpassword });
            await user.save();
            res.status(201).json({ message: "succesfull register " });
        }

    } catch (error) {
        console.log(error);
    }


});
//logout
router.get('/logout',(req,res)=>{
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send("user logout");
})

router.get('/user', authenticate ,(req,res)=>{
   res.send(req.rootUser);
    
})

router.get('/record', authenticate ,(req,res)=>{
    res.send(req.rootUser);
     
 })
 router.post('/sendrecord', authenticate ,async(req,res)=>{
    try{
        const {firstname,disease,symptoms,hospital,doctor} = req.body;
        if(!firstname ||  !disease || !symptoms || !hospital || !doctor){
            return res.json({error:"plzz fill the record"});
        }
        const userContact = await User.findOne({_id:req.userID});
        if(userContact){
            const userRecord = await userContact.addRecord(firstname,disease,symptoms,hospital,doctor);
            await userContact.save();
            res.status(201).json({message:"record concact successfully"})
        }
    }catch(error){
        console.log(error);
    }
     
 })


module.exports = router;