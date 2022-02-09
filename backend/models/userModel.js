const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name :{
        type : 'string',
        required : [true,"Please enter your name"],
        maxlength : [30,"Name can not exceed 30 characters"],
        minlength : [3,"Name should have at least 3 characters"],
    },
    email : {
        type : 'string',
        required : [true,"Please enter your email address"],
        unique : true,
        validate : [validator.isEmail,"Please enter a valid email address"],
    },
    password : {
        type : 'string',
        required : [true,"Please enter your password"],
        minlength : [6,"Name should have at least 6 characters"],
        select : false,
    },
    avatar : {
        public_id : {
            type : String,
            required : true,
        },
        url : {
            type : String,
            required : true,
        }
    },
    role : {
        type : String,
        default : "user",
    },
    passwordResetToken : String,
    resetPasswordExpire : Date ,
    createdAt : {
        type : Date,
        default : Date.now(),
    },
    // createdAt : Date.now(),

});

userSchema.pre("save", async function (next) {

    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
});

//JWT Token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id : this._id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRE,
    });
}

//compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

//Generating password reset token
userSchema.methods.getResetPasswordToken = function (){
    //Generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and adding resetPasswordToken to userSchema
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15*60*1000;

    return resetToken;
}

module.exports = mongoose.model("User",userSchema);