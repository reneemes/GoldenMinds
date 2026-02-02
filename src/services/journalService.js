const connection = require('../db.js');

async function createJournalEntry(userId, title, content) {
  const [result] = await connection.promise().query(
    'INSERT INTO journal (title, body, user_id) VALUES (?, ?, ?);', [
      title,
      content,
      userId
    ]
  );
  return result.insertId;
}

async function getJournalEntries(userId) {
  const [result] = await connection.promise().query(
    `SELECT * 
    FROM journal 
    WHERE user_id = ? 
    ORDER BY created_at DESC;`, [userId]
  );
  return result;
}

async function getOneJournalEntry(userId, journalId) {
  const [result] = await connection.promise().query(
    `SELECT * 
    FROM journal 
    WHERE user_id = ? AND id = ?
    ORDER BY created_at DESC;`, [userId, journalId]
  );
  return result;
}

async function deleteJournalById(userId, journalId) {
  const [result] = await connection.promise().query(
    'DELETE FROM journal WHERE user_id = ? AND id = ?;', [userId, journalId]
  );
  return result;
}

module.exports = {
  createJournalEntry,
  getJournalEntries,
  getOneJournalEntry,
  deleteJournalById
};