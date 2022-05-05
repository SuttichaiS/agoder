const Booking = require("../models/Booking");
const Hotel = require('../models/Hotel');

//@desc Get all booking
//@route GET /api/v1/bookings
//@access Private
exports.getBookings = async (req, res, next) => {
    let query;

     //General users can see only their bookings!
    if(req.user.role !== 'admin'){ 
        query=Booking.find({user:req.user.id}).populate({
            path:'hotel',
            select: 'name province tel'
        });
    }else{ //If you are an admin, you can see all!
            query=Booking.find().populate({
                path:'hotel',
                select: 'name province tel'
            });
    }
    try {
        const bookings = await query;
        console.log(bookings)
        
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });

    }catch(err){
        console.log(err.stack);
        return res.status(500).json({
            success: false,
            message: "Cannot find Booking."
        });
    }
}; 

//@desc Get single booking
//@route GET /api/v1/bookings/:id
//@access Public
exports.getBooking = async (req, res, next) => {
    
    try{
        const booking = await Booking.findById(req.params.id).populate({
            path: 'hotel',
            select: 'name description tel'
        });

        if(!booking) {
            return res.status(404).json({
                success: false,
                message: `No booking with the id of ${req.param.id}`
            })
        }
        //Make sure user is the booking owner
        if(booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to view this booking`
            })
        };
        res.status(200).json({
            success: true,
            data: booking
        })
    }catch(err){
        console.log(err.stack);
        return res.status(500).json({
            success: false,
            message: 'Cannot find Booking'
        })
    }
};

//@desc Add single booking
//@route POST /api/v1/hotel/:hotelID/bookings/
//@access Private
exports.addBooking = async(req, res, next) => {
    try{
        req.body.hotel = req.params.hotelId;
        
        req.body.bookingDate = new Date(req.body.bookingDate)

        // console.log(req.body.bookingDate)

        const hotel = await Hotel.findById(req.params.hotelId);
        const now = new Date()
        
        // console.log(now)

        if(!hotel){
            return res.status(404).json({
                success: false,
                message: `No hotel with the id of ${req.params.hotelId}`
            })
        }

        //Same day booking or past booking not allowed. Reference Agoda
        if(req.body.bookingDate < now) {
            return res.status(400).json({
                success: false,
                message: `Please book your room from tomorrow onward.`
            })
        }

        //add user Id to req.body
        req.body.user = req.user.id;

        //Check for existed booking
        const existedBookings = await Booking.find({user:req.user.id});
        
        //If the user is not an admin, they can only create 3 booking.
        if(existedBookings.length >=3 && req.user.role !== 'Admin'){
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} has already made 3 bookings.`
            })
        }


        const booking = await Booking.create(req.body);
        console.log("Booking")
        console.log(booking)
        res.status(200).json({
            success: true,
            data: booking
        })
    }catch(err){
        console.log(err.stack);
        return res.status(500).json({
            success: false,
            message: 'Cannot create bookings'
        })
    }
}

//@desc Update booking
//@route PUT /api/v1/bookings/:id
//@access Private
exports.updateBooking = async(req, res, next) => {
    try{
        let booking = await Booking.findById(req.params.id);

        if(!booking){
            return res.status(404).json({
                success: false,
                message: `No booking with id of ${req.params.id}`
            });
        }
        
        //Make sure user is the booking owner
        if(booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this booking`
            })
        };

        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        res.status(200).json({
            success: true,
            data: booking
        });
    }catch(err){
        console.log(err.stack);
        return res.status(500).json({
            success: false,
            message: "Cannot update Booking"
        });
    }
}

//@desc Delete booking
//@route DELETE /api/v1/bookings/:id
//@access Private
exports.deleteBooking = async(req, res, next) => {
    try{
        const booking = await Booking.findById(req.params.id);

        if(!booking){
            return res.status(404).json({
                success: false,
                message: `No booking with id of ${req.params.id}`
            })
        };

        if(booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this booking`
            })
        };

        await booking.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    }catch(err){
        console.log(err.stack);
        return res.status(500).json({
            success: false,
            message: "Cannot delete Booking"
        });
    }
}