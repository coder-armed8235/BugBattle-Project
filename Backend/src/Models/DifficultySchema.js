const mongoose = require("mongoose");

const difficultySchema = new mongoose.Schema({
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
});

const Difficulty = mongoose.model("Difficulty", difficultySchema);

module.exports = Difficulty;