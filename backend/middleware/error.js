const ErrorHandler = require('../utils/errorHandler');



module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Inetrnal Server Error";

    // wrong mongodb error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message,400);
    }
    res.status(err.statusCode).json({
        success:false,
        message:err.message,
       //  error:err.stack // gives the location where error occurs
    })
}
