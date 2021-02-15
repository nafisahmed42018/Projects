const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async'); 
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');


// @desc get products
// @route GET /api/v1/products
// @route GET /api/v1/vendors/:vendorId/products
// @access public

exports.getProducts = asyncHandler(async (req, res, next) => {

    let products;
    if (req.params.vendorId) {

        products = await Product.find({ vendor: req.params.vendorId });
        
        return res.status(200).json({
            succes: true,
            count: products.length,
            data: products
        })
    } 
 else {
        res.status(200).json(res.advancedResults);
    }

    
})


// @desc get single products
// @route GET /api/v1/vendors/:Id
// @access public

exports.getProduct = asyncHandler(async (req, res, next) => {
    
    const product = await Product.findById(req.params.id).populate({
        path: 'vendor',
        select: 'name'
    });

    if (!product) {
        return next(new ErrorResponse(`NO product with the id of ${req.params.id}`),404);
    }
 
    res.status(200).json({
        succes: true,
        count: product.length,
        data: product
    })
})





// @desc add product
// @route POST /api/v1/vendors/:vendorId/Proucts
// @access private

exports.addProduct = asyncHandler(async (req, res, next) => {
    req.body.vendor = req.params.vendorId;
    req.body.user = req.user.id;
    const vendor = await Vendor.findById(req.params.vendorId)
    if (!vendor) {
        return next(new ErrorResponse(`No product with the id of ${req.params.id}`),404);
    }
    
    if(vendor.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse("User is not authorized to add product",401));

    }

    const product = await product.create(req.body);
    res.status(201).json({
        succes: true,
        data: product
    })
})


// @desc update product
// @route PUT /api/v1/vendors/:idd
// @access private

exports.updateProduct = asyncHandler(async (req, res, next) => {

    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorResponse(`NO product with the id of ${req.params.id}`),404);
    }

    if(product.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse("User is not authorized to update this vendor",401));
 
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(201).json({
        succes: true,
        data: product
    })
})


// @desc delete product
// @route DELETE /api/v1/vendors/:id
// @access private

exports.deleteProduct = asyncHandler(async (req, res, next) => {

    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorResponse(`NO product with the id of ${req.params.id}`), 404);
    }

    if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse("User is not authorized to update this vendor", 401));
 
    }

    await product.remove();
    res.status(201).json({
        succes: true,
        data: {}
    })
});

// @Desc        upload photo for product
// @route       PUT /api/v1/products/:id/photo
// @access      private

exports.VendorPhotoUpload = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorResponse("Shop doesn't exist", 400));
    }
    if (product.user.toString() !== req.user.id && req.user.role !== 'vendor') {
      return next(
        new ErrorResponse('User is not authorized to update this Vendor', 401)
      );
    }
  
    if (!req.files) {
      return next(new ErrorResponse('Please attach a file', 400));
    }
  
    console.log(req.files);
  
    //Image upload verification
    const file = req.files.file;
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse('Only photos can be attached', 400));
    }
  
    //Check filesize
  
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `File size exceeds the ${process.env.MAX_FILE_UPLOAD} byte limit`,
          400
        )
      );
    }
  
    //Create custom filename
    file.name = `photo_${Vendor._id}${path.parse(file.name).ext}`;
    console.log(file.name);
  
    //move file to specified directory
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with uploading the file`, 500));
      }
  
      await Vendor.findByIdAndUpdate(req.params.id, { photo: file.name });
      res.status(200).json({
        success: true,
        data: file.name,
      });
    });
  });