const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product');

const Product = require('../models/Product');
const advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Product, {
      path: 'vendor',
      select: 'name'
    }),
    getProducts
  )
  .post(protect, authorize('vendor', 'admin'), addProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('vendor', 'admin'), updateProduct)
  .delete(protect, authorize('vendor', 'admin'), deleteProduct);
//router.route('')

module.exports = router;
