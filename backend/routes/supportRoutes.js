const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

router.post('/', supportController.handleSupportRequest);

module.exports = router;