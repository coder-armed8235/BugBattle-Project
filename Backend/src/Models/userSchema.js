const mongoose = require('mongoose');
// const {Schema} = mongoose;

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
        minLength:3,
        maxLength:20
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim: true,
        lowercase:true,
        immutable: true,
    },
    age:{
        type:Number,
        min:6,
        max:80,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default: 'user'
    },
    problemSolved:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'problem',
            unique:true
        }], 
    },
    password:{
        type:String,
        required: true
    },
    location:{
        type:String
    },
    bio:{
        type:String,
        minLength:5,
        maxLength:100
    },
    website:{
        type:String
    },
    twitter:{
        type:String
    },
    github:{
        type:String
    },
    username:{
        type:String
    },
    avatarUrl:{
        type:String,
        default:"https://api.dicebear.com/7.x/notionists/svg?seed=Amit"
    },
    solvedStats: {
    easy: {
      type: Number,
      default: 0,
    },

    medium: {
      type: Number,
      default: 0,
    },

    hard: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },
  },
},{
    timestamps:true
});

const User = mongoose.model("user",userSchema);

module.exports = User;
