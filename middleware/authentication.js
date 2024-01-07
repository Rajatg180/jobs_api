const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError,UnauthenticatedError} = require('../errors');
const jwt = require('jsonwebtoken');

const auth = async (req,res,next) => {
   const authHeader = req.headers.authorization;
    // console.log(authHeader);

   if(!authHeader || !authHeader.startsWith('Bearer ')){
    // console.log(req.header.authorization);
    throw new UnauthenticatedError('Authentication invalid');
   }

   const token = authHeader.split(' ')[1];

   try{
    const payload = jwt.verify(token,process.env.JWT_SECRET);

    console.log(`This is payload of auth middlware ${payload.email}`);

    // this line of code is to remove password 
    // const user = User.findById(payload.userid).select('-password');
    // req.user = user ;


    req.user = {userId : payload.userId,name : payload.name,email : payload.email};

    next();

    }
    catch(err){
        console.log(err);
        throw new UnauthenticatedError('Authentication invalid');
    }

}

module.exports = auth ;