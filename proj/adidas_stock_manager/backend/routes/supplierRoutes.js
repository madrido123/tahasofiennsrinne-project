const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
} = require('../controllers/supplierController');

// @route    GET api/suppliers
// @desc     Get all suppliers
// @access   Private
router.get('/', auth, getSuppliers);

// @route    POST api/suppliers
// @desc     Add new supplier
// @access   Private
router.post('/', auth, addSupplier);

// @route    PUT api/suppliers
// @desc     Update supplier
// @access   Private
router.put('/', auth, updateSupplier);

// @route    DELETE api/suppliers/:id
// @desc     Delete supplier
// @access   Private
router.delete('/:id', auth, deleteSupplier);

module.exports = router;