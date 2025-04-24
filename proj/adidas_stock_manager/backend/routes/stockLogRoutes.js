const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { getStockLogs } = require('../controllers/stockLogController');

// @route    GET api/stock-logs
// @desc     Get stock logs
// @access   Private
router.get('/', auth, getStockLogs);

module.exports = router;