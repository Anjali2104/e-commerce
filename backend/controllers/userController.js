const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError =  require('../middleware/catchAsyncError');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');

//Register a User 
exports.registerUser = catchAsyncError( async(req,res,next) => {
    const {name,email,password} = req.body;
    const user = await User.create({
        name , email, password,
        avatar :  {
            public_id:"this is sample id",
            url :" sampleurl"
        }
    });
    sendToken(user, 201 , res);
  
})
//LOGIN USER
exports.loginUser = catchAsyncError(async(req,res,next) => {
    const {email, password} = req.body;
    // checking if user has enter both email and password
    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password",400))
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));

    }
    const isPasswordMatch = user.comparePassword(password);
    if(!isPasswordMatch){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    
    sendToken(user, 200 , res);
})