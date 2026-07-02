const Problem =require('../Models/problemSchema');
const User= require('../Models/userSchema');
const Submission=require('../Models/submission');
const {getlanguageBYId,submitBatch,submitToken} = require('../utils/problemUtility');
const SolutionVideo= require('../Models/solutionVideo');
const UserActivity= require('../Models/userActivity');
const Difficulty= require('../Models/DifficultySchema');

// const createProblem =async(req,res)=>{
// try{
//   const {title,description,difficulty,tags,
//     visibleTestCases,hiddenTestCases,startCode,referenceSolution}=req.body;
  
   
//   // ek ek language ka batch bana kar bhej rhe hai ek baar c++ ka ek baar java ka
//   //ek baar me sabko batch bana kar bhi bhej sakte hai
//   for(const {language,completeCode} of referenceSolution){
//     const languageid=getlanguageBYId(language);

//      const langConfig =startCode.find(
//               sc => sc.language === language
//             );
//           const firstCode = langConfig.firstCode;
//           const lastCode = langConfig.lastCode;
  
//   // format follow bu judge0
//     //language_id
//     //source_code
//     //stdin
//     //expected_output
//     //hum ek ek test case ko bhej sakte hai but mere pass 50 submission ka limit hai
//     // that's why we will send into batch it means will send multiple test case at once.
//     const submissions=visibleTestCases.map((testcase,index)=>({
//         source_code:firstCode + "\n" + completeCode + "\n" + lastCode,
//         language_id:languageid,
//         stdin:testcase.input,
//         expected_output:testcase.output
//     }))
     
//     //ye return karega sab testacse ke crossponding token aur us token se phir get submission
//     //karene tab uske crossponding status code dega
      

//       const submitResult = await submitBatch(submissions);

//        const resultToken = submitResult.map((value)=> value.token);
//         const testResult = await submitToken(resultToken); 
//              for(const test of testResult){
//               if(test.status_id!=3){
//                return res.status(400).send("Error Occured");
//               }
//              }
//   //  //tho hum har kucch second pe api hit karenge jab tak o status code <3 ho;
//    }
//   //hum yaha direct problem create kar rha hai api abhi nhi hai jo comment code hai
//   //o api ke liye hai
//       const userProblem =  await Problem.create({
//            ...req.body,
//            problemCreator: req.user._id
//          });
         
//     res.status(201).send("Problem Saved Successfully");
//   }
//   catch(error){
//     res.status(400).send("Error: "+error.message);
//   }
// }

const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
      constraints
    } = req.body;

    const encode = (str) => Buffer.from(str || "").toString("base64");

    for (const { language, completeCode } of referenceSolution) {
      const languageid = getlanguageBYId(language);

      const langConfig = startCode.find(
        (sc) => sc.language === language
      );

      if (!langConfig) {
        return res.status(400).send(`Start code missing for ${language}`);
      }

      const { firstCode, lastCode } = langConfig;

      const submissions = visibleTestCases.map((testcase) => ({
        source_code: encode(
          firstCode + "\n" + completeCode + "\n" + lastCode
        ),
        language_id: languageid,
        stdin: encode(testcase.input),
        expected_output: encode(testcase.output),
      }));

      const submitResult = await submitBatch(submissions);
      const tokens = submitResult.map((val) => val.token);
      
      let results = [];
      let isDone = false;

      while (!isDone) {
        results = await submitToken(tokens);

        isDone = results.every((r) => r.status_id >= 3);

        if (!isDone) {
          await new Promise((r) => setTimeout(r, 1500)); // wait 1.5 sec
        }
      }

      // ❗ Validate results
      for (const test of results) {
        if (test.status_id !== 3) {
          return res.status(400).json({
            error: "Reference solution failed",
            details: test,
          });
        }
      }
    }

    // ✅ Save problem
    const userProblem = await Problem.create({
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
      problemCreator: req.user._id,
      constraints
    });

   await Difficulty.findOneAndUpdate(
  {},
  {
    $inc: {
      [`difficultyState.${difficulty}`]: 1,
    },
  },
  {
    new: true,
    upsert: true,
  }
);

    res.status(201).json({
      message: "Problem Saved Successfully",
      problem: userProblem,
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const updateProblem=async(req,res)=>{
  try{
     const _id=req.params.id;
     if(!_id)
     {
      return res.status(401).send("missing problem id")
     }
  
     const dsaProblem = await Problem.findById(_id);
     if(!dsaProblem){
      return res.status(400).send("problem is not present");
     }
      const {title,description,difficulty,tags,
    visibleTestCases,hiddenTestCases,startCode,referenceSolution}=req.body;

    for(const {language,completeCode} of referenceSolution){
    const languageid=getlanguageBYId(language);

         const langConfig =startCode.find(
              sc => sc.language === language
            );
          const firstCode = langConfig.firstCode;
          const lastCode = langConfig.lastCode;
  
    const submissions=visibleTestCases.map((testcase,index)=>({
        source_code:firstCode + "\n" + completeCode + "\n" + lastCode,
        language_id:languageid,
        stdin:testcase.input,
        expected_output:testcase.output
    }))
    
    
      const submitResult = await submitBatch(submissions);
      
       const resultToken = submitResult.map((value)=> value.token);
              
             const testResult = await submitToken(resultToken);
      
             for(const test of testResult){
              if(test.status_id!=3){
               return res.status(400).send("Error Occured");
              }
             }
   }

      const update=  await Problem.findByIdAndUpdate(_id,{...req.body},{runValidators:true, new:true});
        return res.status(201).send(update);
  
  }catch(error){
    res.status(500).send(error.message)
  }
}

const deleteProblem=async(req,res)=>{
   try{
      const id=req.params.id;
      if(!id){
        return res.status(401).send("missing problem Id");
      }

     const deletedProblem=await Problem.findByIdAndDelete(id);
     if(!deleteProblem){
        return res.status(401).send("problem not found");
     }

    //  const deleteVideo= await SolutionVideo.findByIdAndDelete(id);
    //    if(!deleteVideo){
    //     return res.status(401).send("video not found");
    //  }
     return res.status(201).send("Deleted successfully");
   }catch(error){
       return res.status(505).send(error.message);
   }
}

const getProblemById=async(req,res)=>{
    try{
      const problemId=req.params.id;
      if(!problemId){
        return res.status(401).send("missing problem Id");
      }

      const problem = await Problem.findById(problemId);

      const DsaProblem=await Problem.findById(problemId).select('id _id title description difficulty tags visibleTestCases hiddenTestCases startCode referenceSolution constraints');

      if(!DsaProblem){
        return res.status(401).send("Not found");
      }
      const videos = await SolutionVideo.findOne({problemId});
      if(videos){   
      const responseData = {
    ...DsaProblem.toObject(),
    secureUrl:videos.secureUrl,
    thumbnailUrl : videos.thumbnailUrl,
    duration : videos.duration,
    } 
    return res.status(201).send(responseData);
  }
  res.status(201).send(DsaProblem)
    }catch(error){
      return res.status(401).send(error.message);
    }
}

const getAllProblem=async(req,res)=>{
     try{
      const DsaProblem=await Problem.find({}).select('id title difficulty tags');

      if(!DsaProblem){
        return res.status(401).send("Not found");
      }

      res.status(201).send(DsaProblem);
    }catch(error){
      return res.status(401).send(error.message);
    }
}


const solvedProblemByUser=async(req,res)=>{
    try{

      // VVI topic
        const userId=req.user._id;  
        //popupate is used for find actual deta from reference jo proble,Solved ka path hai
      const userDetail=await User.find(userId).populate({
        path:"problemSolved",
        select:"_id title tags difficulty"
      });
      return res.status(201).send(userDetail[0].problemSolved);
    }catch(error){
      return res.status(500).send("Server Error");
    }
}

const submitProblem=async(req,res)=>{
      try{
        const userId=req.user._id;
      const problemId=req.params.id;

      const submitAnswer=await Submission.find({userId,problemId});
      if(submitAnswer.length==0)
      {
        res.status(204).json({
          message:"not found"
        });
      }
      res.status(201).send(submitAnswer);
      }
      catch(error){
        res.status(501).json(error.message);
      }

}

const activity = async(req, res) => {
  try {
    const { year } = req.params;
    const userId = req.user.id;

    const start = `${year}-01-01`;
    const end = `${year}-12-31`;

    const data = await UserActivity.find({
      userId,
      date: { $gte: start, $lte: end }
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const difficulty=async(req,res) =>{
  try{
      const data = await Difficulty.find();
      res.status(200).json({
        message:"ok",
        data
      })
  }catch(error){
     res.send(error.message);
  }
}

const recentlySolvedProblems = async (req, res) => {
  try {
    const userId = req.user.id;
    const problems = await Submission.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('problemId', 'title difficulty')

      const formattedProblems = problems.map((item) => ({
      problemId: item.problemId._id,
      title: item.problemId.title,
      status: item.status,
      createdAt: item.createdAt
}));
    res.status(200).json({
      success: true,
      formattedProblems
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports={createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedProblemByUser,submitProblem,activity,difficulty,recentlySolvedProblems};