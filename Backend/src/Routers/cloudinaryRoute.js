const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const userMiddleware = require('../middleware/userMiddleware');
const videoRouter =  express.Router();
const {generateUploadSignature,imageUploadSignature,saveVideoMetadata,deleteVideo} = require('../controller/cloudinaryUpload');

videoRouter.get("/create/:problemId",adminMiddleware,generateUploadSignature);
videoRouter.post("/save",adminMiddleware,saveVideoMetadata);
videoRouter.delete("/delete/:problemId",adminMiddleware,deleteVideo);

videoRouter.get("/cloudinary/signature",userMiddleware,imageUploadSignature);
module.exports = videoRouter;