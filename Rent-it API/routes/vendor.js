const express = require('express');
const router = express.Router();
// Included items
const productRouter = require('./product');
const { getVendors,
    getVendor,
    createVendor,
    updateVendor,
    deleteVendor,
    //getVendorsWithinRadius,
    VendorPhotoUpload
} = require("../controllers/vendor");

const {protect, authorize} = require('../middleware/auth');
const Vendor = require('../models/Vendor');
const advancedResults = require('../middleware/advancedResults')
// Re-route to other resources
router.use('/:vendorId/products', productRouter);


router.route('/')
    .get(advancedResults(Vendor,'products'), getVendors)
    .post(protect,authorize("vendor"),createVendor);

router.route('/:id')
    .get(protect,getVendor) 
    .put(protect,authorize('vendor',"admin"),updateVendor)
    .delete(protect,authorize('vendor',"admin"),deleteVendor);

router.route('/:id/photo').put(protect,authorize('vendor',"admin"),VendorPhotoUpload);

/*router.route('/radius/:zipcode/:distance')
    .get(getVendorsWithinRadius)*/

module.exports = router;




