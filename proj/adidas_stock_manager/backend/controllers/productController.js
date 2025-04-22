const Product = require('../models/Product');
const StockLog = require('../models/StockLog');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ status: 'success', products });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Add new product
exports.addProduct = async (req, res) => {
  const { name, price, quantity, category, image } = req.body;

  try {
    const newProduct = new Product({
      name,
      price,
      quantity,
      category,
      image,
    });

    const product = await newProduct.save();

    // Log the stock addition
    const newLog = new StockLog({
      productId: product._id,
      productName: product.name,
      quantity: product.quantity,
      action: 'Ajout',
    });
    await newLog.save();

    res.json({ status: 'success', product });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  const { id, name, price, quantity, category, image } = req.body;

  try {
    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    const oldQuantity = product.quantity;
    const quantityChange = quantity - oldQuantity;

    product = await Product.findByIdAndUpdate(
      id,
      { $set: { name, price, quantity, category, image } },
      { new: true }
    );

    // Log the stock change if quantity changed
    if (quantityChange !== 0) {
      const action = quantityChange > 0 ? 'Ajout' : 'Retrait';
      const newLog = new StockLog({
        productId: product._id,
        productName: product.name,
        quantity: Math.abs(quantityChange),
        action,
      });
      await newLog.save();
    }

    res.json({ status: 'success', product });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    // Log the stock deletion
    const newLog = new StockLog({
      productId: product._id,
      productName: product.name,
      quantity: product.quantity,
      action: 'Suppression',
    });
    await newLog.save();

    await Product.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
