const connection = require('../db.js');

async function createMessageEntry(name, email, message, reason) {
  const [result] = await connection.promise().query(
    'INSERT INTO contact_messages (name, email, message, reason) VALUES (?, ?, ?, ?)', 
    [name, email, message, reason]
  );
  return result.insertId;
}

module.exports = { createMessageEntry };