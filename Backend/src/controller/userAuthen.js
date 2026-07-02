const validate=require('../utils/validator');
const bcrypt=require('bcrypt');
const User=require('../Models/userSchema');
const Submission= require('../Models/submission');
const jwt=require('jsonwebtoken');
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const redisClient=require('../config/redis')
//register
const register=async(req,res)=>{
    try{
        validate(req.body);

    const {password}=req.body;
    req.body.password=await bcrypt.hash(password,10);
    req.body.role='user';
    await User.create(req.body);
    res.status(201).send("Registerd sucessfully");
    }
    catch(error){
        res.status(400).json({
            message:"Email already registered"
        });
    }
}

//login
const login=async(req,res)=>{
    try {
        const {emailId,password}=req.body;

        if(!emailId || !password)
            throw new Error("Invalid credential");

        const result= await User.findOne({emailId});
        if(!result){
            throw new Error("Invalid credential");
        }

        const reply={
            fullName:result.fullName,
            emailId:result.emailId,
            _id:result._id,
            role:result.role,
            avatarUrl:result.avatarUrl

        }
        const isValid=await bcrypt.compare(password, result.password);

        if(!isValid){
         throw new Error("Invalid credential");
        }

        const token = jwt.sign({_id: result._id,emailId: result.emailId,role:result.role}, process.env.JWT_KEY, {expiresIn: "12h"});
        res.cookie("token",token,{
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 1000,
      });
        res.status(200).json({
            user:reply,
            message:"login successfully!"
        });

    }
    catch (error) {
        res.status(401).json({
            message:error.message
        });
    }
}
//logout
const logout= async(req,res)=>{
   try{
    
     const token=req.cookies.token;
    const payload=jwt.decode(token);
    // await redisClient.set(`token:${token}`,'Blocked');
    // await redisClient.expireAt(`token:${token}`,payload.exp);

    // await redisClient.set(`token:${token}`, "Blocked", {
    //  EXAT: payload.exp
    // });
    res.cookie("token",null,{expires:new Date(Date.now())});
    res.status(200).send('logout successfully');
   }
   catch(error){
        res.status(401).send(error.message)
   }
}

const forgetPassword=async(req,res)=>{
    try {
    const { emailId } = req.body;
    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If the account exists, an OTP has been sent."
      });
    }

    const otp = crypto.randomInt(100000, 1000000);

    await redisClient.set(
      `reset-otp:${emailId}`,
      otp.toString(),
      {
        EX: 300, // 5 min
      }
    );

    const subject = "Password Reset Request - Action Required";

    await sendEmail(
      emailId,
      subject,
      otp
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

const verifyOtp =async(req,res)=>{
  try{
     const { emailId , otp } = req.body;

  const storedOtp = await redisClient.get(
    `reset-otp:${emailId}`
  );

  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  await redisClient.del(`reset-otp:${emailId}`);

  // Reset JWT create karo
  const resetToken = jwt.sign(
    { emailId },
    process.env.JWT_KEY,
    { expiresIn: "10m" }
  );

res.cookie("token", resetToken, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 10 * 60 * 1000,
});

  return res.status(200).json({
    success: true,
    message: "OTP verified",
  });

  }catch(error){
    res.send(error.message)
  }
}

const changePassword= async(req,res)=>{
try{
  const {newpassword,confirmPassword}=req.body;
   console.log(req.user);
  if (newpassword !== confirmPassword) {
  return res.status(400).json({
    success: false,
    message: "Passwords do not match",
  });
}
  req.user.password= await bcrypt.hash(newpassword,10);
 
  await req.user.save();

  res.status(200).json({
    message:"Sucesses"
  })
  }catch(error){
    res.json(error.message)
  }
}
//get profile
const profile= async(req,res)=>{
  try{
       const userDetail=req.user;
       const reply={
        username:userDetail.username,
        fullName:userDetail.fullName,
        location:userDetail.location,
        bio:userDetail.bio,
        website:userDetail.website,
        twitter:userDetail.twitter,
        github:userDetail.github,
        solvedStats:userDetail.solvedStats,
        problemSolved:userDetail.problemSolved.length,
        avatarUrl:userDetail.avatarUrl
      };
      res.status(200).send(reply);
  }
  catch(error){
    res.status(201).send(error.message)
  }
    
}

const adminRegister=async(req,res)=>{
    try{
       validate(req.body);
    const {password,role}=req.body;
    if(!role)
        throw new Error("send the role");

    const existingUser = await User.findOne({ emailId: req.body.emailId });
        if (existingUser) {
          return res.status(400).json({
            message: "Email already exists"
          });
        }
    req.body.password=await bcrypt.hash(password,10);
    const data=await User.create(req.body);
    res.status(201).send("Registerd sucessfully");
}
 catch(error){
        res.status(400).json({
            message:error.message
        });
    } 
}

const deleteProfile=async(req,res)=>{
    try{
    const userId=req.user._id;
    await User.findByIdAndDelete(userId);
    await Submission.deleteMany({userId});

    res.status(200).send("account deleted successfully");
    }
    catch(error){
         res.status(500).send("server error occur");
    }

}

const updateProfile= async(req,res)=>{
    try{

        const userId = req.user._id;
        const data = req.body;
        const updatedUser = await User.findByIdAndUpdate(
        userId,
        data,
      {
        new: true, 
        runValidators: true,
      });
    
      res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
        
    }catch(err){
        res.status(500).json({
      message: err.message,
    });
    }
}


module.exports={register,login,logout,profile,adminRegister,deleteProfile,updateProfile,forgetPassword,verifyOtp,changePassword};