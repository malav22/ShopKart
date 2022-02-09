const ErrorHandler = require('../utils/errorhander');

module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error!";

//Wrong mongodb id error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message,400);
    }
//Duplicate email error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)}`;
        err = new ErrorHandler(message,400);
    }


//Wrong jwt error
    if(err.name === "JsonWebTokenError"){
        const message = `Json Web Token is invalid , try again.`;
        err = new ErrorHandler(message,400);
    }

//JWT expire error
    if(err.name === "TokenExpiredError"){
        const message = `Json Web Token is expired , try again.`;
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        error: err.stack,
    });
};