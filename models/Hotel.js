const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a hotel name'],
        unique: true,
        trim: true,
        maxlength: [50, "Hotel name cannot be more than 50 characters"],
    },
    address: {
        type: String,
        required: [true, 'Please add hotel address']
    },
    province: {
        type: String,
        required: [true, 'Please a province']        
    },
    tel:{
        type: String,
        required: [true, 'Please a telephone number']
    }
});

module.exports = mongoose.model('Hotel', HotelSchema); 