const ErrorHandler = require('../utils/errorHandler');



module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Inetrnal Server Error";

    // wrong mongodb ID error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message,400);
    }
    // mongoose duplicate key error
    if(err.code === 11000 ){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message,400);
    }
    // wrong JWT TOKEN error
    if(err.name === "JsonWebTokenError"){
        const message = `Json web Token is Invalid, Try again`;
        err = new ErrorHandler(message,400);
    }
      // JWT Expire error
      if(err.name === "TokenExpiredError"){
        const message = `Json web Token is Expired, Try again`;
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
       //  error:err.stack // gives the location where error occurs
    })
}
