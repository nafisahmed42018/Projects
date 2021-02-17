const NodeGeocoder = require('node-geocoder');

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: 'https',
  apiKey: 'AIzaSyBMXTGA2ghpqQhWPpOljx0w35GJUUNDaP8',
  formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
