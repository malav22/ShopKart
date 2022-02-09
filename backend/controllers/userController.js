const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');
const cloudinary = require("cloudinary");

//Create user
exports.createUser = catchAsyncErrors(async(req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

    const {name,email,password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
    });

    const token = user.getJWTToken();

    sendToken(user,201,res);
});

//Login User

exports.loginUser = catchAsyncErrors(async(req, res, next)=>{
    const {email,password} = req.body;

    //Checking if both email and password are given
    if(!email || !password){
        return next(new ErrorHander("Please enter email and password"),400);
    }

    const user = await User.findOne({email}).select("+password");
    
    if(!user){
        return next(new ErrorHander("Invalid email or password"),401);
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHander("Invalid email or password"),401);
    }
    const token = user.getJWTToken();

    sendToken(user,200,res);
});

//Logout user

exports.logout = catchAsyncErrors(async(req, res,next)=>{

    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
            success : true,
            message : "Logged out successfully.",
        }
    );
});

//forget password
exports.forgotPassword = catchAsyncErrors(async(req, res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHander("User not found",404));
    }

    //Get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave : false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

    const message = `Your password reset token is : \n\n ${resetPasswordUrl} \n\nIf you have not requested this mail , please ignore.`;

    try{
        await sendEmail({
            email : user.email,
            subject : `ShopKart Password Reset`,
            message,

        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    }
    catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave : false});

        return next(new ErrorHander(error.message,500));
    }
});

//reset password
exports.resetPassword = catchAsyncErrors(async(req, res,next)=>{

    //creatig hash token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : { $gt : Date.now()},
    });

    if(!user){
        return next(new ErrorHander("Reset password token is invalid or has been expired.",400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHander("Password does not match",400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user,200,res);
});

//get user details
exports.getUserDetails = catchAsyncErrors(async(req, res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success : true,
        user,
    });
});

//Update user password
exports.updatePassword = catchAsyncErrors(async(req, res,next)=>{
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHander("Old password is incorrect."),400);
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHander("Password does not match",400));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user,200,res);
});

//Update user profile
exports.updateProfile = catchAsyncErrors(async(req, res,next)=>{
    
    newUserData = {
        name : req.body.name,
        email : req.body.email,
    }

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);
    
        const imageId = user.avatar.public_id;
    
        await cloudinary.v2.uploader.destroy(imageId);
    
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });
    
        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      
    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new :true,
        runValidators : true,
        useFindAndModify : false,
    });
    res.status(200).json({
        success : true,
    });
});

//Get all users --Admin

exports.getAllUser = catchAsyncErrors(async(req, res)=>{
    const users = await User.find();
    res.status(200).json({
        succes : true,
        users
    });
});


//Get single user --Admin
exports.getSingleUser = catchAsyncErrors(async(req, res)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHander(`User does not exist with given id: ${req.params.id}`),400);
    }
    res.status(200).json({
        succes : true,
        user
    });
});

//Update User role --Admin
exports.updateUserRole = catchAsyncErrors(async(req, res,next)=>{
    
    newUserData = {
        name : req.body.name,
        email : req.body.email,
        role : req.body.role,
    }

    // we will add cloudinary later
    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new :true,
        runValidators : true,
        useFindAndModify : false,
    });
    // console.log(user._id);
    // console.log(user._id=="61f151c0e56ef7f35d594668");
    if(user._id=="62027f6aba929a16eade06a9"){
        return next(new ErrorHander(`You cannot change role FOUNDER of this Website.`),400);
    }
    if(!user){
        return next(new ErrorHander(`User does not exist with given id: ${req.params.id}`),400);
    }
    res.status(200).json({
        success : true,
    });
});

//Delete User --Admin

exports.deleteUser = catchAsyncErrors(async(req, res,next)=>{
    
    const user = await User.findById(req.params.id);
    if(user._id=="62027f6aba929a16eade06a9"){
        return next(new ErrorHander(`You cannot delete FOUNDER of this Website`),400);
    }
    if(!user){
        return next(new ErrorHander(`User does not exist with given id: ${req.params.id}`),400);
    }
    await user.remove();
    // we will remove cloudinary later
    
    res.status(200).json({
        success : true,
        message : 'User deleted successfully',
    });
});

//Create new Review or Update reviews

exports.createProductReview = catchAsyncErrors(async(req, res,next)=>{
    
    const {rating,comment,productId} = req.body;


    const review = {
        user : req.user._id,
        name : req.user.name,
        rating : Number(rating),
        comment,
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());

    if(isReviewed){
        product.reviews.forEach(rev =>{
            if(rev.user.toString() === req.user._id.toString()){
                rev.rating = rating;
                rev.comment = comment;
            }
        });
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    let avg = 0;
    product.rating = product.reviews.forEach(rev => {
        avg += rev.rating;
    });
    product.rating = avg/ product.reviews.length;

    await product.save({validateBeforeSave : false});
    res.status(200).json({
        success : true,

    })
});