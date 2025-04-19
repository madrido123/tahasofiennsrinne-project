const Category = require('../models/Category');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ status: 'success', categories });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Add new category
exports.addCategory = async (req, res) => {
  const { name } = req.body;

  try {
    let category = await Category.findOne({ name });
    if (category) {
      return res.status(400).json({ status: 'error', message: 'Category already exists' });
    }

    category = new Category({
      name,
    });

    await category.save();
    res.json({ status: 'success', category });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  const { id, name } = req.body;

  try {
    let category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ status: 'error', message: 'Category not found' });
    }

    category = await Category.findByIdAndUpdate(
      id,
      { $set: { name } },
      { new: true }
    );

    res.json({ status: 'success', category });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ status: 'error', message: 'Category not found' });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
