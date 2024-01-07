const { CustomAPIError } = require('../errors');
const User = require('../models/User');
const {StatusCodes}=require('http-status-codes');
const BadRequestError= require('../errors/bad-request');
const UnauthenticatedError = require('../errors/unauthenticated');

// library to hash the password
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const register = async (req,res) =>{

    // handeling custom error
    // we can handle this error with mongoose
    // const {name,email,password} = req.body;

    // if(!name || !email || !password){
    //     throw new BadRequestError("Please provide blank fields")
    // }

    // password hashing which is not good practice so we has password in model folder itself
    // const {name, email,password} = req.body;
    // // it will generate 10 bits of random value
    // const salt = await bcrypt.genSalt(10);

    // const hashedPassword = await bcrypt.hash(password,salt);

    // const tempUser = {name,email,password : hashedPassword};

    // const user = await User.create({...tempUser});
    

    // creating the user in mongodb 
    const user = await User.create({...req.body});

    // const token =jwt.sign({userId : user._id , name : user.name},'jwtSecrete',{expiresIn : '30d'});

    const token = user.createJWT();

    // res.status(StatusCodes.CREATED).json({user :{ username :user.name},token});

    res.status(StatusCodes.CREATED).json({user :{ username :user.getName()},token});
}

const login = async (req,res) =>{

    const {email,password} = req.body;

    if(!email || !password){
        throw new BadRequestError("Please provide email and password ")
    }

    // comapring email and get the user 
    const user = await User.findOne({email});

    // if user is not present we will send costum error that 
    if(!user){
        throw new UnauthenticatedError("Please provide valid credenatils");
    }

    // if user present then only we will compare password 
    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new UnauthenticatedError("Please provide valid credenatils");
    }

    // if user is present we will send back the token 
    const token = user.createJWT();

    res.status(StatusCodes.OK).json({name:{name:user.getName(),id:user._id},token});
}

module.exports = {register,login};

