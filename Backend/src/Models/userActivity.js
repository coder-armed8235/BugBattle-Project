const mongoose = require('mongoose');
const {Schema} = mongoose;

const userActivity= new Schema({
   userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  date: {
    type: String, // "YYYY-MM-DD"
    required: true
  },
  count: {
    type: Number,
    default: 0
  }  
})
userActivity.index({ userId: 1, date: 1 }, { unique: true });


const UserActivity=mongoose.model('userActivity',userActivity);

module.exports = UserActivity;