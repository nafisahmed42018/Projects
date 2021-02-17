const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');

// @desc      Get products
// @route     GET /api/v1/products
// @route     GET /api/v1/vendors/:vendorId/products
// @access    Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  if (req.params.vendorId) {
    const products = await Product.find({ vendor: req.params.vendorId });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single product
// @route     GET /api/v1/products/:id
// @access    Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({
    path: 'vendor',
    select: 'name description'
  });

  if (!product) {
    return next(
      new ErrorResponse(`No product with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc      Add product
// @route     POST /api/v1/vendors/:vendorId/products
// @access    Private
exports.addProduct = asyncHandler(async (req, res, next) => {
  req.body.vendor = req.params.vendorId;
  req.body.user = req.user.id;

  const vendor = await Vendor.findById(req.params.vendorId);

  if (!vendor) {
    return next(
      new ErrorResponse(
        `No vendor with the id of ${req.params.vendorId}`,
        404
      )
    );
  }

  // Make sure user is vendor owner
  if (vendor.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a product to vendor ${vendor._id}`,
        401
      )
    );
  }

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc      Update product
// @route     PUT /api/v1/products/:id
// @access    Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`No product with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is product owner
  if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update product ${product._id}`,
        401
      )
    );
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  product.save();

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc      Delete product
// @route     DELETE /api/v1/products/:id
// @access    Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`No product with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is product owner
  if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete product ${product._id}`,
        401
      )
    );
  }

  await product.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
