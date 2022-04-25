const express = require('express');
const dotenv = require('dotenv');

const connectDB = require('./config/db');


//Load env vars
dotenv.config({path:'./config/config.env'})
//Connect to DB
connectDB();

const app = express();

//Body parser
app.use(express.json());

const hotels = require('./routes/hotels.js');
app.use('/api/v1/hotels', hotels)

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, 'mode on port ', PORT)) 

//Handle unhandled promise rejections
process.on('unhandledRejection', (err,promise) => {
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    server.close(()=> process.exit(1));
}
);