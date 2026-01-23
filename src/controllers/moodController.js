import { 
  saveMoodEntry,
  getAllMoodEntries
 } from '../services/moodService.js';

export async function createMood(req, res) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  const { mood } = req.body;

  try {
    const result = await saveMoodEntry(req.session.userId, mood);
    res.status(201).json({ message: 'Mood saved!', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to save mood.'});
  }
}

export async function getAllMoods(req, res) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  const range = req.query.range || 'week';
  try {
    const moods = await getAllMoodEntries(req.session.userId, range);
    res.status(200).json({ moods });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to retrieve mood history.' });
  }
}