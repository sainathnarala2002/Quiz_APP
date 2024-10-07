const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    topic: { type: String, required: true, unique: true },
    questions: [
        {
            questionText: String,
            options: [String],
            correctAnswer: String
        }
    ]
});

module.exports = mongoose.model('Quiz', QuizSchema);