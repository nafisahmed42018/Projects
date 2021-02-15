const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Vendor = require('../models/Vendor');
const geocoder = require('../utils/geocoder');

// @Desc        get Vendor
// @route       GET /api/v1/Vendors
// @access      public
exports.getVendors = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @Desc        get specified Vendor
// @route       GET /api/v1/Vendors
// @access      public
exports.getVendor = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    return next(new ErrorResponse("Shop doesn't exist", 400));
  }
  res.status(200).json({
    success: true,
    data: vendor,
  });
});

// @Desc        create new Vendor
// @route       POST /api/v1/Vendors
// @access      private
exports.createVendor = asyncHandler(async (req, res, next) => {
  //add user to req boddy
  req.body.user = req.user.id;
  //console.log(req.body)
  //check for published vendor
  const publishedVendor = await Vendor.findOne({ user: req.user.id });
  if (publishedVendor && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`The user has already been registered as a Vendor`, 400)
    );
  }
  if (!publishedVendor) {   
    const vendor = await Vendor.create(req.body);
    res.status(201).json({
    success: true,
    message: 'Vendor created',
    data: vendor,
  });
  }

  
});

// @Desc        update vendor details
// @route       POST /api/vendors
// @access      private

exports.updateVendor = asyncHandler(async (req, res, next) => {
  let vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    return next(new ErrorResponse("Shop doesn't exist", 400));
  }

  if (vendor.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('User is not authorized to update this Vendor', 401)
    );
  }

  vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    success: true,
    message: 'Vendor updated',
    data: vendor,
  });
});

// @Desc        create new Vendor
// @route       DELETE /api/v1/Vendors
// @access      private
exports.deleteVendor = asyncHandler(async (req, res, next) => {
  let vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    return next(new ErrorResponse("Shop doesn't exist", 400));
  }
  if (vendor.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('User is not authorized to update this Vendor', 401)
    );
  }
  vendor.remove();
  res.status(201).json({
    success: true,
    message: 'Vendor deleted',
  });

  console.log();
});

// @Desc
// @route       GET /api/v1/Vendors/readius/:zipcode/:distance
// @access      private

/*exports.getVendorsWithinRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  const radius = distance / 6378;
  const Vendors = await Vendor.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: Vendors.length,
    data: Vendors,
  });
});*/

// @Desc        upload photo for Vendor
// @route       PUT /api/v1/Vendors/:id/photo
// @access      private

exports.VendorPhotoUpload = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    return next(new ErrorResponse("Shop doesn't exist", 400));
  }
  if (vendor.user.toString() !== req.user.id && req.user.role !== 'vendor') {
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
