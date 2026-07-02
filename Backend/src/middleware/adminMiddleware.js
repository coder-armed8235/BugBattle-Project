
//token dene ke baad har user ko authenticate karna hai ki hn yahi user hai n

const User=require('../Models/userSchema');
const jwt = require('jsonwebtoken');
//const redisClient= require('../config/redis');
const adminMiddleware=async(req,res,next)=>{
    try{
        
      const token=req.cookies.token;
      const payload = jwt.verify(token, process.env.JWT_KEY);
    // payload = { userId, emailId, iat, exp }

    const Admin = await User.findById({_id:payload._id});
        
    if (!Admin) {
      throw new Error("user not find");
    }


    // const isBlocked= await redisClient.exists(`token:${token}`);
   
    // if(isBlocked){
    //   throw new Error("please Login Again");
    // }
    
    if(Admin.role!='admin')
        throw new Error("You are not admin");
    
     req.user=Admin;
       
     next();
    }
    catch(error){
        res.status(503).send("Error: "+ error.message)
    }
}

module.exports=adminMiddleware;