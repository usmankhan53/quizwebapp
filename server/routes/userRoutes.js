const express = require('express');
const router = express.Router();
const User = require('../model/User');

// POST /api/users/user - Create a new user if not exists, or return existing user
router.post('/user', async (req, res) => {
    const { username } = req.body;

    try {
        // Try to find an existing user with the given username
        let user = await User.findOne({ username });

        if (!user) {
            // If user doesn't exist, create a new one
            const newUser = new User({ username });
            user = await newUser.save();
        }

        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// PUT /api/users/:username/quizResults - Update quiz results array for a user by username
router.put('/:username/quizResults', async (req, res) => {
    const { username } = req.params;
    const { title, score, totalQuestions } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newQuizResult = { title, score, totalQuestions };
        user.quizResultsArray.push(newQuizResult);
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET /api/users - Fetch all users
router.get('/user', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
