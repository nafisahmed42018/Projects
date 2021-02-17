const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  type: {
    type: String,
    enum: ['vehicle', 'event decor', 'accommodation', 'appliances'],
    required:[true, "Please add a type between vehicle,event decor,accommodation or appliances"]
  },
  cost: {
    type: String,
    required: [true, 'Please add a cost']
  },
  available: {
    type: Boolean,
    default: false
  },
  photo: {
    type: String,
    default: 'no-photo.jpg',
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must can not be more than 10']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  vendor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vendor',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});



module.exports = mongoose.model('Product', ProductSchema);
