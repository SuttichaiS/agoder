const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Route files
const hotels = require('./routes/hotels.js');
const auth = require('./routes/auth');

//Load env vars
dotenv.config({path:'./config/config.env'})
//Connect to DB
connectDB();

const app = express();

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//Mount routers
app.use('/api/v1/hotels', hotels)
app.use('/api/v1/auth', auth);


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, 'mode on port ', PORT)) 

//Handle unhandled promise rejections
process.on('unhandledRejection', (err,promise) => {
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    server.close(()=> process.exit(1));
}
);