const mongoose = require('mongoose');



const DB='mongodb+srv://bishtchirag13:chiragbisht13@cluster0.5tdxhbm.mongodb.net/healthaura?retryWrites=true&w=majority';
mongoose.connect(DB,{
}).then(() =>{
    console.log('connection');
}).catch((error) => console.log('no connection'));