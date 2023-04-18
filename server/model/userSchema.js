const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required:true
    },
    lastname:{
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    cpassword: {
        type: String,
        required:true
    },
    date:{
        type: Date,
        default:Date.now
    },
    record:[
        {
            firstname: {
                type: String,
                required:true
            },
            disease: {
                type: String,
                required:true
            },
            symptoms: {
                type: String,
                required:true
            },
            hospital: {
                type: String,
                required:true
            },
            doctor: {
                type: String,
                required:true
            },
        }
    ],
    tokens: [
        {
            token:{
                type: String,
                required:true
            }
        }
    ]
})



userSchema.pre('save',async function(next){
    console.log("hi")
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword,12);

    }
    next();

});

//genereating token
userSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id:this.id}, process.env.SECRET_key);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token;
    }catch(error){
        console.log(error);
    }
}

userSchema.methods.addRecord = async function(firstname,disease,symptoms,hospital,doctor){
    try{
        this.record = this.record.concat({firstname,disease,symptoms,hospital,doctor})
        await this.save();
        return this.record;
    }catch(error){
        console.log(error)
    }
} 

const User = mongoose.model('PATIENT',userSchema);

module.exports = User;