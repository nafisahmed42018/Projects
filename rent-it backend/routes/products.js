const express = require('express');
const {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/products');

const Product = require('../models/Product');

const router = express.Router({ mergeParams: true });

const reviewRouter = require('./reviews');

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Product, {
      path: 'vendor',
      select: 'name description slug'
    }),
    getProducts
  )
  .post(protect, authorize('vendor', 'admin'), addProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('vendor', 'admin'), updateProduct)
  .delete(protect, authorize('vendor', 'admin'), deleteProduct);

router.use('/:productId/reviews', reviewRouter);

module.exports = router;
