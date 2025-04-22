const StockLog = require('../models/StockLog');

// Get stock logs with filters
exports.getStockLogs = async (req, res) => {
  const { type, period } = req.query;
  
  try {
    let query = {};
    
    // Filter by action type
    if (type && type !== 'all') {
      query.action = type;
    }
    
    // Filter by period
    if (period && period !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (period) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
      }
      
      query.datetime = { $gte: startDate };
    }
    
    const logs = await StockLog.find(query).sort({ datetime: -1 });
    res.json({ status: 'success', logs });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
