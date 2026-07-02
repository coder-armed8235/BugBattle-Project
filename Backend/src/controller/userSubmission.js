const Problem = require('../Models/problemSchema');
const Submission = require("../Models/submission");
const {getlanguageBYId,submitBatch,submitToken} = require("../utils/problemUtility");
const User= require('../Models/userSchema');
const UserActivity= require('../Models/userActivity');

const submitCode=async(req,res)=>{
try{
       const userId = req.user._id;
       const problemId = req.params.id;

       let {code,language} = req.body;  

      if(!userId||!code||!problemId||!language)
        return res.status(400).send("Some field missing");

       if(language==='cpp')
        language='c++';
    //    Fetch the problem from database
       const problem =  await Problem.findById(problemId);
    
    const submittedResult = await Submission.create({
          userId,
          problemId,
          code,
          language,
          status:'pending',
          testCasesTotal:problem.hiddenTestCases.length
        })

    //    Judge0 code ko submit karna hai

    const languageId = getlanguageBYId(language);

    const langConfig = problem.startCode.find(
              sc => sc.language === language
            );
          const firstCode = langConfig.firstCode;
          const lastCode = langConfig.lastCode;
            
           const encode = (str) =>
      Buffer.from(str || "").toString("base64");

    // 🔓 Decode for frontend
    const decode = (str) =>
      str ? Buffer.from(str, "base64").toString("utf-8") : "";

    const submissions = problem.hiddenTestCases.map((testcase)=>({
        source_code:encode(firstCode + "\n" + code + "\n" + lastCode),
        language_id: languageId,
        stdin: encode(testcase.input),
        expected_output: encode(testcase.output)
    }));


    const submitResult = await submitBatch(submissions);

    
    
    const resultToken = submitResult.map((value)=> value.token);

    const testResult = await submitToken(resultToken);
    

    // submittedResult ko update karo
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errorMessage = null;


    // for(const test of testResult){
    //     if(test.status_id==3){
    //        testCasesPassed++;
    //        runtime = runtime+parseFloat(test.time)
    //        memory = Math.max(memory,test.memory);
    //     }else{
    //       if(test.status_id==4){
    //         status = 'error'
    //         errorMessage = test.stderr
    //       }
    //       else{
    //         status = 'wrong'
    //         errorMessage = test.stderr
    //       }
    //     }
    // }
    const normalize = (str) =>
  (str ? Buffer.from(str, "base64").toString("utf-8") : "")
    .trim()
    .replace(/\r/g, "");

    for (const test of testResult) {
  const output = normalize(test.stdout);
  const expected = normalize(test.expected_output);

  if (output === expected) {
    testCasesPassed++;
    runtime += parseFloat(test.time || 0);
    memory = Math.max(memory, test.memory || 0);
  } else {
    status = "wrong";  

    errorMessage = {
      input: normalize(test.stdin),
      expected,
      output
    };

    break;
  }
}

    // Store the result in Database in Submission
    submittedResult.status   = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;

    await submittedResult.save();

    if(!req.user.problemSolved.includes(problemId)){
      req.user.problemSolved.push(problemId);
      await req.user.save();
    }

    if (status === "accepted") {

  // current submission ko exclude karo
  const alreadySolved = await Submission.findOne({
    userId,
    problemId,
    status: "accepted",
    _id: { $ne: submittedResult._id }
  });

  // first accepted submission
  if (!alreadySolved) {

    await User.findByIdAndUpdate(userId, {
      $inc: {
        [`solvedStats.${problem.difficulty}`]: 1,
        "solvedStats.total": 1,
      },
      $addToSet: {
        problemSolved: problemId
      }
    });

  }
}

    const accepted=(status=='accepted')
       if (accepted) {
        const today = new Date().toISOString().slice(0, 10);
        await UserActivity.findOneAndUpdate(
        { userId, date: today },
        { $inc: { count: 1 } },
        { upsert: true }
      );
    }
    res.status(201).json({
      accepted,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory
    });
       
    }
    catch(err){
      console.log(err)
      res.status(500).send("Internal Server Error "+ err);
    }

}

const runCode = async (req, res) => {
  try {
    const userId = req.user._id;
    const problemId = req.params.id;
    let { code, language } = req.body;

    if (!userId || !code || !problemId || !language) {
      return res.status(400).send("Some field missing");
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).send("Problem not found");
    }

    if (language === "cpp") language = "c++";

    const langConfig = problem.startCode.find(
      (sc) => sc.language === language
    );

    if (!langConfig) {
      return res.status(400).send("Language not supported");
    }

    const { firstCode, lastCode } = langConfig;
    const languageId = getlanguageBYId(language);

    // 🔐 Encode for Judge0
    const encode = (str) =>
      Buffer.from(str || "").toString("base64");

    // 🔓 Decode for frontend
    const decode = (str) =>
      str ? Buffer.from(str, "base64").toString("utf-8") : "";

    // 🧪 Prepare submissions
    const submissions = problem.visibleTestCases.map((tc) => ({
      source_code: encode(firstCode + "\n" + code + "\n" + lastCode),
      language_id: languageId,
      stdin: encode(tc.input),
      expected_output: encode(tc.output),
    }));

    // 🚀 Submit
    const submitResult = await submitBatch(submissions);
    const tokens = submitResult.map((t) => t.token);

    // 🔁 Polling
    let results = [];
    let done = false;

    while (!done) {
      results = await submitToken(tokens);
      done = results.every((r) => r.status_id >= 3);

      if (!done) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    // 🧠 Verdict mapping
    const getVerdict = (id) => {
      switch (id) {
        case 3: return "Accepted";
        case 4: return "Wrong Answer";
        case 5: return "Time Limit Exceeded";
        case 6: return "Compilation Error";
        default: return "Runtime Error";
      }
    };

    // 📊 Evaluate
    let passed = 0;
    let runtime = 0;
    let memory = 0;
    let verdict = "Accepted";
    let errorMessage = null;

    for (const test of results) {
      if (test.status_id === 3) {
        passed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      } else {
        verdict = getVerdict(test.status_id);
        errorMessage =
          decode(test.stderr) ||
          decode(test.compile_output) ||
          test.message;
        break;
      }
    }

    // 🔓 Decode for frontend
    const formattedResults = results.map((r) => ({
      ...r,
      stdin: decode(r.stdin),
      stdout: decode(r.stdout),
      expected_output: decode(r.expected_output),
      stderr: decode(r.stderr),
      compile_output: decode(r.compile_output),
    }));

    // 📤 Response
    res.status(200).json({
      success: verdict === "Accepted",
      verdict,
      passed,
      total: results.length,
      runtime,
      memory,
      testCases: formattedResults,
      errorMessage,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
module.exports={submitCode,runCode};