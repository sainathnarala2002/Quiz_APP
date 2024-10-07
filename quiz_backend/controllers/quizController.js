const Quiz = require('../models/quizModel');
const User = require('../models/userModel');

let quizController = {};

// Fetch quiz questions
quizController.getQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ topic: req.params.topic });
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        res.json(quiz);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Submit quiz and calculate score
quizController.submitQuiz = async (req, res) => {
    const { answers } = req.body;
    try {
        const quiz = await Quiz.findOne({ topic: req.params.topic });
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        let score = 0;
        quiz.questions.forEach((q, index) => {
            if (q.correctAnswer === answers[index]) score++;
        });

        const user = await User.findById(req.user.id);
        user.scores.push({ topic: req.params.topic, score });
        await user.save();

        res.json({ score });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Get leaderboard
quizController.getLeaderboard = async (req, res) => {
    try {
        const users = await User.find().select('email scores');
        const leaderboard = users.map(user => ({
            email: user.email,
            scores: user.scores
        }));

        res.json(leaderboard);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

module.exports = quizController;