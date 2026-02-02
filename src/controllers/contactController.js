const { createMessageEntry } = require('../services/contactService.js');

async function createMessage(req, res) {
  const { 
    name, 
    email,
    message,
    reason 
  } = req.body;

  try {
    await createMessageEntry(name, email, message, reason);
    res.status(201).json({ message: 'Message sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to send message.' });
  }
}
module.exports = { createMessage };