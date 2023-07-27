const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError =  require('../middleware/catchAsyncError');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');

//REGISTER USER
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

// LOGIN USER
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
// LOGOUT USER
exports.logoutUser = catchAsyncError(async(req,res,next) => {

   res.cookie('token',null, {
    expires: new Date(Date.now()),
    httpOnly:true
   });
    res.status(200).json({
        success:true,
        message:"Logged Out Successfully!"
    });
})
// FORGOT PASSWORD

exports.forgotPassword = catchAsyncError(async(req,res,next) => {
    const user =  await User.findOne({email:req.body.email});
    if(!user) {
        return next(new ErrorHandler("user not found", 404));
    }
    //Get reset password token
    const resetToken =  user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});
    

})