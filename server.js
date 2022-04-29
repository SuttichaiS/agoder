const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

const connectDB = require('./config/db');


// Route files
const hotels = require('./routes/hotels.js');
const auth = require('./routes/auth.js');
const bookings = require('./routes/bookings.js');

//Load env vars
dotenv.config({path:'./config/config.env'})

//Connect to DB
connectDB();

const app = express();

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS attack
app.use(xss());

//Rate limiting
const limiter = rateLimit({
    windowsMs:1*60*1000, //1 Mins
    max: 100
});
app.use(limiter);

//Prevent http param pollutions
app.use(hpp());

//Enable CORS
app.use(cors());

//Mount routers
app.use('/api/v1/hotels', hotels)
app.use('/api/v1/auth', auth);
app.use('/api/v1/bookings', bookings);


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, 'mode on port ', PORT)) 

//Handle unhandled promise rejections
process.on('unhandledRejection', (err,promise) => {
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    server.close(()=> process.exit(1));
}
);