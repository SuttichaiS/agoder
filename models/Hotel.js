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
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});;

//Cascade delete bookings when a hotels is deleted
HotelSchema.pre('remove', async function(next){
    console.log(`Bookings is being removed from hotel ${this._id}`);
    await this.model('Booking').deleteMany({hotel: this._id});
    next();
  });

//Reverse populate with virtuals
HotelSchema.virtual('bookings', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'hotel',
    justOne: false
  });

module.exports = mongoose.model('Hotel', HotelSchema); 