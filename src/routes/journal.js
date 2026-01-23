import express from 'express';
import { createJournal, getAllJournalEntries, deleteJournal } from '../controllers/journalController.js';

const router = express.Router();

router.post('/', createJournal);
router.get('/', getAllJournalEntries);
router.delete('/:journalId', deleteJournal)

export default router;
