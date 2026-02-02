const connection = require('../db.js');

async function createMoodEntry(userId, mood) {
  const [result] = await connection
    .promise()
    .query(`
      INSERT INTO mood (mood, user_id, mood_date)
      VALUES (?, ?, CURDATE())
      ON DUPLICATE KEY UPDATE
        mood = VALUES(mood),
        created_at = CURRENT_TIMESTAMP;
      `, [
        mood,
        userId
      ]);
  return result;
}

async function getAllMoodEntries(userId, range) {
  let interval = '';

  switch (range) {
    case 'week':
      interval = 'INTERVAL 7 DAY';
      break;
    case 'month':
      interval = 'INTERVAL 1 MONTH';
      break;
    case 'year':
      interval = 'INTERVAL 1 YEAR';
      break;
    default:
      interval = 'INTERVAL 7 DAY';
  }

  const [result] = await connection
    .promise()
    .query(
      `
        SELECT *
        FROM mood
        WHERE user_id = ?
          AND created_at >= DATE_SUB(NOW(), ${interval})
        ORDER BY created_at DESC;
      `,
      [userId]
    )
  return result;
}

module.exports = {
  createMoodEntry,
  getAllMoodEntries
};