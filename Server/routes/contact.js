// routes/contactRoutes.js
const express = require('express');
const { saveContactMessage } = require('../controllers/contactController');

const router = express.Router();


router.post('/contact', saveContactMessage);

module.exports = router;
