const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({

    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a Product title']
        
    },

    description: {
        type: String,
        required: [true, 'Please add description']

    },

    type: {
        type: String,
        enum: ['vehicle', 'event decor', 'accommodation', 'appliances'],
        required:[true, "Please add a type between vehicle,event decor,accommodation or appliances"]
    },
    
    location: {
        type: String,
        required: [true, 'Please add a location']
    },

    cost: {
        type: Number,
        required: [true, 'Please add a cost']

    },


    Available: {
        type: Boolean,
        default: false
        
    },
    
    photo: {
        type: String,
        default: 'no-photo.jpg',
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
  
})




module.exports = mongoose.model('Product', ProductSchema);