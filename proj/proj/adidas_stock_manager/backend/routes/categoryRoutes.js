const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');


router.get('/', auth, getCategories);


router.post('/', auth, addCategory);


router.put('/', auth, updateCategory);


router.delete('/:id', auth, deleteCategory);

module.exports = router;