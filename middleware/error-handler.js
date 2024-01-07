const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {

  let customError={
    // set default
    statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg : err.message || 'Something went wrong try again later'
  }
  
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }


  // handeling the validation err if any field is not provided while registration 
  if(err.name === "ValidationError"){

    // just printing to be clear 
    console.log(err);
    console.log(Object.values(err.errors));

    customError.msg = Object.values(err.errors).map((item)=>item.message).join(', ');
    customError.statusCode = 400
  }

  // handeling the duplicate email error
  if(err.code  && err.code === 11000){
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choode another value`
    customError.statusCode = 400
  }

  // handleing the cast error 
  if(err.name === "CastError"){
    customError.msg = `No id find with ${err.value}`;
    customError.statusCode =  404
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({"msg":customError.msg}); 

}

module.exports = errorHandlerMiddleware
