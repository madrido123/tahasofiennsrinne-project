const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

// @route    GET api/categories
// @desc     Get all categories
// @access   Private
router.get('/', auth, getCategories);

// @route    POST api/categories
// @desc     Add new category
// @access   Private
router.post('/', auth, addCategory);

// @route    PUT api/categories
// @desc     Update category
// @access   Private
router.put('/', auth, updateCategory);

// @route    DELETE api/categories/:id
// @desc     Delete category
// @access   Private
router.delete('/:id', auth, deleteCategory);

module.exports = router;