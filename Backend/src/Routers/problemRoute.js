const express= require('express')
const problemRoute=express.Router();
const userMiddleware=require('../middleware/userMiddleware');
const adminMiddleware=require('../middleware/adminMiddleware');
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedProblemByUser,submitProblem,activity,difficulty,recentlySolvedProblems}= require('../controller/problemController')
//admin role
//create problem
problemRoute.post('/create',adminMiddleware,createProblem);
//update problem
problemRoute.put('/update/:id',adminMiddleware,updateProblem);
//delete problem
problemRoute.delete('/delete/:id',adminMiddleware,deleteProblem);

// //user Role
//get problem
problemRoute.get('/problemById/:id',getProblemById);
problemRoute.get('/getAllproblem',getAllProblem);
problemRoute.get('/problemSolved',userMiddleware,solvedProblemByUser);
problemRoute.get('/submitProblem/:id',userMiddleware,submitProblem)
problemRoute.get('/difficulty',userMiddleware,difficulty)
problemRoute.get('/activity/:year',userMiddleware,activity);
problemRoute.get('/recently/solved',userMiddleware,recentlySolvedProblems);

module.exports=problemRoute;