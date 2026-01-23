import connection from '../db.js';

export async function saveMoodEntry(userId, mood) {
  const [result] = await connection
    .promise()
    .query(`
      INSERT INTO mood (mood, user_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
        mood = VALUES(mood),
        created_at = CURRENT_TIMESTAMP
      `, [
        mood,
        userId
      ]);
  return result;
}

// Service file is just for handling the DB

export async function getAllMoodEntries(userId, reange) {
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
        ORDER BY created_at DESC
      `,
      [userId]
    )
  return result;
}