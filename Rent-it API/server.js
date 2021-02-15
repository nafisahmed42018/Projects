const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
//midddlewares

const errorHandler = require('./middleware/error');
//load environment vars
dotenv.config({ path: "./config/config.env" });
//load routes
const vendors = require('./routes/vendor')
const products = require('./routes/product')
const auth = require('./routes/auth')

connectDB();

const app = express();

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
app.use(express.json());

app.use(cookieParser());

app.use(fileupload());
app.use(express.static(path.join(__dirname,'public')))

//  Mount Route
app.use('/api/v1/vendors', vendors);
app.use('/api/v1/products', products);
app.use('/api/v1/auth', auth);
app.use(errorHandler);

const PORT = process.env.PORT;
const server = app.listen(PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

//for handdling unhandled promise rejections    
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message.red}`);
    //close the server and exit process
    server.close(() => process.exit(1));
});