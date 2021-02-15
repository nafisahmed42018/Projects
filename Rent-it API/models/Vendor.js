const mongoose = require('mongoose');
const slugify = require('slugify')
const geocoder = require('../utils/geocoder');

const VendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cant be more than 50 characters'],
    },

    slug: String,

    description: {
        type: String,
        required: [true, "Please add a description"],
        maxlength: [500, 'Description cant be more than 500 characters'],
    },

    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },

    phone: {
        type: String,
        minlength: [9, "Enter a valid phone number"],
        maxlength: [15, "Number exceeded digit limit"]
    },

    email: {
        type: String,
        match: [
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
            'Please add a valid mail'
        ]
    },

    address: {
        type:String,
        required: [true, 'Please add an address'],
    },

    location: {
        //GeoJSON
        type: {
            type: String,
            enum: ['Point'],
            //required: true,
        },
        coordinates: {
            type: [Number],
            //required: true,
            index: '2dsphere',
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
    

    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must can not be more than 10']
    },
    
    //averageCost: Number,
      
    photo: {
        type: String,
        default: 'no-photo.jpg',
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    user:{
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    }
    

}, {
        toJSON: {virtuals:true},
        toObject: {virtuals:true}
    
});

// Create vendor slug from the name
VendorSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {
        lower: true,
        replacement:'-'
    })
    next();
})

// Geocode and location
/*VendorSchema.pre('save', async function (next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].country,

    }
    this.address = undefined;
    next();
})****/

// Cascade delete proddduct

VendorSchema.pre('remove', async function (next) {
    console.log('Vendor deleted')
    await this.model('Product').deleteMany({vendor:this.id})
})


//reverse populate with virtuals
// creating the virtual; takes in model we are going to relate to
VendorSchema.virtual('products',{
    ref: 'Product',
    localField: '_id',
    foreignField: 'vendor',
    justOne:false
})

module.exports = mongoose.model('Vendor',VendorSchema);