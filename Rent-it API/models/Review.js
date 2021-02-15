const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, 'Please add some text'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  vendor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Item',
    required: true,
  },
});

// Prevent user from submitting more than one review per vendor
ReviewSchema.index({ vendor: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
ReviewSchema.statics.getAverageRating = async function (vendorId) {
  const obj = await this.aggregate([
    {
      $match: { vendor: vendorId },
    },
    {
      $group: {
        _id: '$vendor',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    await this.model('Vendor').findByIdAndUpdate(vendorId, {
      averageRating: obj[0].averageRating,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
ReviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.vendor);
});

// Call getAverageCost before remove
ReviewSchema.post('remove', async function () {
  await this.constructor.getAverageRating(this.vendor);
});

module.exports = mongoose.model('Review', ReviewSchema);
