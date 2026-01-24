const express = require('express');
const { 
  createJournal, 
  getAllJournalEntries, 
  deleteJournal 
} = require('../controllers/journalController.js');

const router = express.Router();

router.post('/', createJournal);
router.get('/', getAllJournalEntries);
router.delete('/:journalId', deleteJournal);

module.exports = router;
