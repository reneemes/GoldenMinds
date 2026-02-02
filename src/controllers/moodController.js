const { 
  createMoodEntry,
  getAllMoodEntries
} = require('../services/moodService.js');

async function createMood(req, res) {
  if (!req.user?.id) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { mood } = req.body;

  try {
    const result = await createMoodEntry(req.user.id, mood);
    res.status(201).json({ message: 'Mood saved!', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to save mood.'});
  }
}

async function getAllMoods(req, res) {
  if (!req.user?.id) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const range = req.query.range || 'week';
  try {
    const moods = await getAllMoodEntries(req.user.id, range);
    res.status(200).json({ moods });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to retrieve mood history.' });
  }
}

module.exports = {
  createMood,
  getAllMoods
};