import express from 'express';
import { createMood, getAllMoods } from '../controllers/moodController.js';

const router = express.Router();

router.post('/', createMood);
router.get('/:userId', getAllMoods);

export default router;