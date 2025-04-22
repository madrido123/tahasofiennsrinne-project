const Supplier = require('../models/Supplier');

// Get all suppliers
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json({ status: 'success', suppliers });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Add new supplier
exports.addSupplier = async (req, res) => {
  const { name, contact, address } = req.body;

  try {
    const supplier = new Supplier({
      name,
      contact,
      address,
    });

    await supplier.save();
    res.json({ status: 'success', supplier });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Update supplier
exports.updateSupplier = async (req, res) => {
  const { id, name, contact, address } = req.body;

  try {
    let supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ status: 'error', message: 'Supplier not found' });
    }

    supplier = await Supplier.findByIdAndUpdate(
      id,
      { $set: { name, contact, address } },
      { new: true }
    );

    res.json({ status: 'success', supplier });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Delete supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ status: 'error', message: 'Supplier not found' });
    }

    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Supplier removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
