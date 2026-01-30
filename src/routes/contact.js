const express = require('express');
const { createMessage } = require('../controllers/contactController.js');

const router = express.Router();

router.post('/', createMessage);

module.exports = router;