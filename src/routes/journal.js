const express = require('express');
const { 
  createJournal, 
  getAllJournalEntries, 
  deleteJournal 
} = require('../controllers/journalController.js');
const auth = require("../middleware/auth.js");

const router = express.Router();

router.use(auth);

router.post('/', createJournal);
router.get('/', auth, getAllJournalEntries);
router.delete('/:journalId', deleteJournal);

module.exports = router;
