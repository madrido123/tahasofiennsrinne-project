const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// @route    GET api/products
// @desc     Get all products
// @access   Private
router.get('/', auth, getProducts);

// @route    POST api/products
// @desc     Add new product
// @access   Private
router.post('/', auth, addProduct);

// @route    PUT api/products
// @desc     Update product
// @access   Private
router.put('/', auth, updateProduct);

// @route    DELETE api/products/:id
// @desc     Delete product
// @access   Private
router.delete('/:id', auth, deleteProduct);

module.exports = router;