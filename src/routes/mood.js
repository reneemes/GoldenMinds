const express = require('express');
const { createMood, getAllMoods } = require('../controllers/moodController.js');
const auth = require("../middleware/auth.js");

const router = express.Router();

router.use(auth);

router.post('/', createMood);
router.get('/', getAllMoods);

module.exports = router;