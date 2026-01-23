import { 
  saveJournalEntry, 
  getJournalEntries, 
  deleteJournalById 
} from '../services/journalService.js';

export async function createJournal(req, res) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  const { title, content } = req.body;

  try {
    const journalId = await saveJournalEntry(req.session.userId, title, content);
    res.status(201).json({ message: 'Journal created!', journalId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to save journal entry.' });
  }
}

export async function getAllJournalEntries(req, res) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  try {
    const journalEntries = await getJournalEntries(req.session.userId);
    res.status(200).json({ journalEntries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to retrieve journal entries.' });
  }
}

export async function deleteJournal(req, res) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  const { journalId } = req.params;
  try {
    await deleteJournalById(req.session.userId, journalId);
    res.status(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete journal entry.' });
  }
}