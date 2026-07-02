
//token dene ke baad har user ko authenticate karna hai ki hn yahi user hai n

const User=require('../Models/userSchema');
const jwt = require('jsonwebtoken');
const redisClient= require('../config/redis');
const userMiddleware=async(req,res,next)=>{
    try{
        
      const token=req.cookies.token;
      const payload = jwt.verify(token, process.env.JWT_KEY);
    // payload = { userId, emailId, iat, exp }
      
    const user = await User.findOne({emailId:payload.emailId});
        
    if (!user) {
      throw new Error("user not find");
    }
  //    console.log("before checking token")
    const isBlocked= await redisClient.exists(`token:${token}`);
    if(isBlocked){
      throw new Error("please Login Again");
    }

     req.user=user;
       
     next();
    }
    catch(error){
        res.status(503).send("Error: "+ error.message)
    }
}

module.exports=userMiddleware;