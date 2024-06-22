// models/Quiz.js

const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: String,
      options: [String],
      answer: Number,
    },
  ],
  
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
