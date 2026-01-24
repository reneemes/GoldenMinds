const express = require('express');
const { createMood, getAllMoods } = require('../controllers/moodController.js');

const router = express.Router();

router.post('/', createMood);
router.get('/:userId', getAllMoods);

module.exports = router;