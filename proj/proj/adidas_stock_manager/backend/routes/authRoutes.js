const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser } = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');


router.post('/register', register);


router.get('/login', (req, res) => {
  res.status(405).json({ status: 'error', message: 'Method GET not allowed. Use POST to login.' });
});

router.post('/login', login);


router.get('/user', auth, getCurrentUser);

module.exports = router;
