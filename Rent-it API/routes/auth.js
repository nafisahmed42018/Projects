const express = require('express');
const {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  updateDetails,
  updatePassword,
} = require('../controllers/auth');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/user', protect, getCurrentUser);
router.put('/updatedetails', protect, updateDetails);
router.post('/forgotpassword', forgotPassword);
router.post('/updatepassword', protect, updatePassword);

module.exports = router;
