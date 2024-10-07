const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth');

// User Routes

// POST /api/user/register
router.post('/register', userController.registerUser);

// POST /api/user/verify-otp
router.post('/verify-otp', userController.verifyOTP);

// POST /api/user/login
router.post('/login', userController.loginUser);

router.get('/profile', auth, userController.getProfile);



// Quiz Routes

router.get('/quiz/:topic', auth, quizController.getQuiz);
router.post('/quiz/:topic', auth, quizController.submitQuiz);
router.get('/leaderboard', quizController.getLeaderboard);

module.exports = router;
