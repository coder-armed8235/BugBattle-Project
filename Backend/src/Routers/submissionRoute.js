const express = require('express');
const userMiddleware = require('../middleware/userMiddleware');
const submitRoute=express.Router();
const {submitCode,runCode}= require('../controller/userSubmission')

submitRoute.post('/submit/:id',userMiddleware,submitCode);
submitRoute.post('/run/:id',userMiddleware,runCode);

module.exports=submitRoute;