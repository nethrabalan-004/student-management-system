const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController'); // Make sure this is correct

// Login Route
router.post('/login', loginController.login);  // This is the route you need

module.exports = router;
