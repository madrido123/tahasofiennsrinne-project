
const StockLog = require('../models/StockLog');
const Product = require('../models/Product');

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
          startDate = new Date(now.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(now.getMonth() - 1);
          break;
      }
      
      query.datetime = { $gte: startDate };
    }
    
    // Populate productId to get product name if productName is missing
    const logs = await StockLog.find(query).populate('productId').sort({ datetime: -1 });
    console.log('Stock logs retrieved:');
    logs.forEach(log => {
      console.log(`ID: ${log._id}, productName: ${log.productName}, productId.name: ${log.productId ? log.productId.name : 'N/A'}`);
    });
    // Send productName as is and format datetime
    const mappedLogs = logs.map(log => {
      const obj = log.toObject();
      return {
        _id: obj._id,
        product_id: obj.productId._id || obj.productId,
        productName: obj.productName || (obj.productId && obj.productId.name) || 'Unknown',
        quantity: obj.quantity,
        action: obj.action,
        datetime: obj.datetime.toISOString(),
      };
    });
    res.json({ status: 'success', logs: mappedLogs });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
