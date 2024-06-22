const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizResultSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    }
});

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true // Ensures each username is unique
    },
    quizResultsArray: {
        type: [quizResultSchema], // Array of quizResultSchema objects
        default: [] // Default value is an empty array
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
