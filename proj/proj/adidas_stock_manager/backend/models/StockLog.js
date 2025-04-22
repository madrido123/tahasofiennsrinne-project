const mongoose = require('mongoose');

const StockLogSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  action: {
    type: String,
    enum: ['Ajout', 'Retrait', 'Suppression'],
    required: true,
  },
  datetime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('StockLog', StockLogSchema);