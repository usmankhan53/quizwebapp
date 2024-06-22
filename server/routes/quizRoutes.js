const express = require('express');
const Quiz = require('../model/Quiz');

const router = express.Router();

// Route to create a new quiz
router.post('/quiz', async (req, res) => {
  try {
    const {category, title, questions } = req.body;
    const quiz = new Quiz({ category, title, questions });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to delete a quiz
router.delete('/quiz/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Quiz.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to get all quizzes
router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Route to get a specific quiz by ID
router.get('/quiz/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const quiz = await Quiz.findById(id);
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }
      res.json(quiz);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;
