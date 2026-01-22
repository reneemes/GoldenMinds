require('dotenv').config();
const path = require('path');
const express = require('express');
const hbs = require('hbs');

const port = process.env.PORT || 8080;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and view location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// Save a journal entry to the DB
app.post('/journal', async (req, res) => {
  // Check user is logged in
  if (!req.session.userId) {
    return res.redirect('/login');
    // return res.status(401).json({ message: 'Not logged in' });
  }
  const userId = req.session.userId;

  try {
    const { title, content } = req.body;

    const [result] = await connection
    .promise()
    .then('INSERT INTO journal (title, content, user_id) VALUES (?, ?, ?)', [
        title,
        content,
        userId
      ]);
    res.status(201).json({ message: 'Journal entry created!', userId: result.insertId });

  } catch (error) {
    res.status(400).json({ error: 'Unable to save journal entry.' })
  }
});

// Save a mood to the DB
app.post('/mood', async (req, res) => {
  // Check user is logged in
  if (!req.session.userId) {
    return res.redirect('/login');
    // return res.status(401).json({ message: 'Not logged in' });
  }
  const userId = req.session.userId;

  try {
    const { mood } = req.body;

    if (!mood) {
      return res.status(400).json({ message: 'Mood is required' });
    }

    const [result] = await connection
    .promise()
    .then(`
      INSERT INTO mood (mood, user_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
        mood = VALUES(mood),
        created_at = CURRENT_TIMESTAMP
      `, [
        mood,
        userId
      ]);
    res.status(201).json({ message: 'Mood saved!', userId: result.insertId });

  } catch (error) {
    res.status(400).json({ error: 'Unable to save current mood.' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: 'Something went wrong',
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});