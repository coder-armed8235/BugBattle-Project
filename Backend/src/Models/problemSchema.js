const mongoose = require('mongoose');
const {Schema} = mongoose;

const problemSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum:['easy','medium','hard'],
        required:true,
    },
    tags:{
        type:String,
        enum:['math','array','linkedList','graph','dp','tree','stack','queue','string'],
        required:true
    },
    visibleTestCases:[
        {
            input: {
            type: Schema.Types.Mixed,
            required: true
    },
            output:{
                type:String,
                required:true,
            },
            explanation:{
                type:String,
                required:true
            }
        }
    ],
    hiddenTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            }
        }
    ],

    startCode: [
        {
            language:{
                type:String,
                required:true,
            },
            initialCode:{
                type:String,
                required:true
            },
            firstCode:{
                type:String,
            },
            lastCode:{
                type:String,
                required:true
            }
        }
    ],

    referenceSolution:[
        {
            language:{
                type:String,
                required:true,
            },
            completeCode:{
                type:String,
                required:true
            }
        }
    ],

    problemCreator:{
        type: Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    constraints:[
        {
            inputLength:{
                type:String,
                required:true
            },
            inputValue:{
                type:String,
                required:true
            }
        }
    ]
})


const Problem = mongoose.model('problem',problemSchema);

module.exports = Problem;