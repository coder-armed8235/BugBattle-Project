const express=require('express');
const app=express();
require('dotenv').config();
const main=require('./config/database');
const redisClient=require('./config/redis')
const cookieParser = require('cookie-parser');
const authRoute= require('./Routers/userAuth');
const problemRoute=require('./Routers/problemRoute');
const submitRoute= require('./Routers/submissionRoute');
const rateLimit = require('express-rate-limit');
const aiRouter= require('./Routers/aiChatting');
const videoRouter = require('./Routers/cloudinaryRoute');

const cors=require('cors')

const allowedOrigins = [
  "http://localhost:5173",                    // local
  "https://bug-battle-project.vercel.app",    // agar koi custom domain ho
  "https://bug-battle-project-c996nq9di-coderarmed.vercel.app",  // ← Yeh add karo
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50 // limit each IP to 50 requests per windowMs
});

app.use('/Auth',authRoute);
app.use('/problem',problemRoute)
app.use('/submission',submitRoute);
app.use('/video',videoRouter);
app.use('/ai',aiRouter);


const initialChecking=async()=>{

try{
      // redisClient.connect()
  await Promise.all([main(),redisClient.connect()]);
  console.log("Redis database connection succeefully");
  console.log("database connection successfully");

   app.listen(process.env.PORT,()=>{
      console.log("Listing port No. 4000");
})
}
catch(error){
  console.log(error.message);
}
}

initialChecking();