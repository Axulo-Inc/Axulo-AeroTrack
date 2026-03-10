const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../utils/validation');

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
} = require('../controllers/auth.controller');

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

module.exports = router;
