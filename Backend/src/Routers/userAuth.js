const express= require('express')
const authRoute=express.Router();
const {register,login,logout,profile,adminRegister,deleteProfile, updateProfile,forgetPassword,verifyOtp,changePassword }=require('../controller/userAuthen');
const userMiddleware=require('../middleware/userMiddleware');
const adminMiddleware=require('../middleware/adminMiddleware');
const uploadImage= require('../middleware/uploadImage')

//register
authRoute.post('/register',register);
//login
authRoute.post('/login',login);
//profile
authRoute.get('/profile',userMiddleware,profile);

//updateprofile
authRoute.patch('/update/profile',userMiddleware,updateProfile);
//logout
authRoute.get('/logout',userMiddleware,logout);

authRoute.post('/forget/password',forgetPassword);
authRoute.post('/forget/password/verify',verifyOtp );
authRoute.post('/password/change',userMiddleware,changePassword);

//check router
authRoute.get('/check',userMiddleware,(req,res)=>{
    const reply={
           fullName:req.user.fullName,
            emailId:req.user.emailId,
            _id:req.user._id,
            role:req.user.role
        }

        res.status(201).json({
            user:reply,
            message:"valid user"
        })
})

//admin register
authRoute.post('/admin/register',adminMiddleware,adminRegister);

authRoute.delete('/deleteProfile',userMiddleware,deleteProfile);

module.exports=authRoute;