const axios = require('axios');

const getlanguageBYId=(lang)=>{
    const language={
        "c++":54,
        "java":62,
        "javascript":63
    }

    return language[lang.toLowerCase()];
}

// const submitBatch = async (submissions)=>{ 

// const options = {
//   method: 'POST',
//   url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//   params: {
//     base64_encoded: 'false'
//   },
//   headers: {
//     'x-rapidapi-key': process.env.JUDGE0_KEY,
//     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
//     'Content-Type': 'application/json'
//   },
//   data: {
//     submissions
//   }
// };

// async function fetchData() {
//     try {
//         const response = await axios.request(options);
//         return response.data;
//     } catch (error) {
//         console.error(error);
//     }
// }
//  return await fetchData();
// }

const submitBatch = async (submissions) => {
  if (!Array.isArray(submissions) || submissions.length === 0) {
    throw new Error("Submissions array is invalid");
  }

  try {
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions/batch",
      { submissions },
      {
        params: {
          base64_encoded: "true", // ✅ MUST
        },
        headers: {
          "x-rapidapi-key": process.env.JUDGE0_KEY,
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        timeout: 10000, // ⏱️ prevent hanging
      }
    );

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Invalid response from Judge0");
    }

    return response.data;

  } catch (error) {
    console.error("❌ Judge0 Batch Error:", error.response?.data || error.message);
    throw error; // 🔥 important
  }
};

const waiting = async(timer)=>{
  setTimeout(()=>{
    return 1;
  },timer);
}

// ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

const submitToken = async(resultToken)=>{

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(","),
    base64_encoded: 'true',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': 'ab99c6ec42mshfd636ec7c6687efp1b9043jsna684835b0591',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
 while(true){

 const result =  await fetchData();

  const IsResultObtained =  result.submissions.every((r)=>r.status_id>2);

  if(IsResultObtained)
    return result.submissions;

  
  await waiting(1000);
}



}

module.exports={getlanguageBYId,submitBatch,submitToken};