const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'c++', 'java'] 
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'wrong', 'time_limit_exceeded','error','compilation_error','runtime_error'],
    default: 'pending'
  },
  runtime: {
    type: Number,  // milliseconds
    default: 0
  },
  memory: {
    type: Number,  // kB
    default: 0
  },
  errorMessage:{
   input:{
      type:String,
      default:''
   },
   expected:{
      type:String,
      default:''
   },
   output:{
      type:String,
      default:''
   }
},
  testCasesPassed: {
    type: Number,
    default: 0
  },
  testCasesTotal: {  // Recommended addition
    type: Number,
    default: 0
  }
}, { 
  timestamps: true
});

//userId and problem id ke combination se indexing knowns as compound indexing
// userId:1 , problem:1  it means arrange in ascending order {-1 means decending order}
submissionSchema.index({userId:1,problemId:1})


const Submission = mongoose.model("submission",submissionSchema);

module.exports = Submission;