const express = require('express');
const {
  getVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
  vendorPhotoUpload
} = require('../controllers/vendors');

const Vendor = require('../models/Vendor');

// Include other resource routers
const productRouter = require('./products');


const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:vendorId/products', productRouter);

router
  .route('/:id/photo')
  .put(protect, authorize('vendor', 'admin'), vendorPhotoUpload);

router
  .route('/')
  .get(advancedResults(Vendor, 'products'), getVendors)
  .post(protect, authorize('vendor'), createVendor);

router
  .route('/:id')
  .get(getVendor)
  .put(protect, authorize('vendor', 'admin'), updateVendor)
  .delete(protect, authorize('vendor', 'admin'), deleteVendor);

module.exports = router;
