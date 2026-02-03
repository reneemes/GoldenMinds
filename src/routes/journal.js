const express = require('express');
const { 
  createJournal, 
  getAllJournalEntries, 
  getJournalEntry,
  deleteJournal 
} = require('../controllers/journalController.js');
const auth = require("../middleware/auth.js");

const router = express.Router();

router.use(auth);

router.post('/', createJournal);
router.get('/', getAllJournalEntries); 
router.get('/:journalId', getJournalEntry);
router.delete('/:journalId', deleteJournal);

module.exports = router;
