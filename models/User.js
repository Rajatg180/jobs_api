const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserScheme = new mongoose.Schema({
    name: {
        type : String , 
        required : [true,'Please provide name'],
        minlength : 3,
        maxlength : 30,
    },

    email: {
        type : String , 
        required : [true,'Please provide email'],
        minlength : 3,
        maxlength : 30,
        match :[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide valid email"
        ],
        unique : true,
    },

    password: {
        type : String , 
        required : [true,'Please provide password'],
        minlength : 6,
        // the hash password length is so big so we cant set maxLenght
        // maxlength : 30,
    },

});

// alternate way to hash password 
UserScheme.pre('save',async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

// this method will act on every document 
UserScheme.methods.getName = function (){
    return this.name;
}

UserScheme.methods.createJWT = function (){
    return jwt.sign({userId : this._id , name : this.name,email : this.email},process.env.JWT_SECRET,{expiresIn :process.env.JWT_LIFETIME});
}

// comparing the password for login 
UserScheme.methods.comparePassword = async function (candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    return isMatch;
}


module.exports = mongoose.model('User',UserScheme);
