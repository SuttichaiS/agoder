const Hotel = require('../models/Hotel.js');

//@desc Get all hotels
//@route GET /api/v1/hotels
//@access Public
exports.getHotels = async (req,res,next) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json({
            success:true,
            count: hotels.length,
            data:hotels
        });
    } catch (err) {
        res.status(400).json({
            success:false
        });
    }
}

//@desc Get single hotel
//@route GET /api/v1/hotels/:id
//@access Public
exports.getHotel = async (req,res,next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);

        if(!hotel) {
            // console.log(hotel)
            return res.status(400).json({success:false});
        }

        res.status(200).json({success: true, data: hotel});
    } catch(err){
        // console.log(err)
        res.status(400).json({success: false });
    }
}

//@desc Create a hotel
//@route POST /api/v1/hotels
//@access Private
exports.createHotel = async (req,res,next) => {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({
        success: true,
        data:hotel
    })
}

//@desc Update single hotel
//@route PUT /api/v1/hotels/:id
//@access Private
exports.updateHotel = async (req,res,next) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!hotel) {
            // console.log(`error hotel: ${hotel}`)
            return res.status(400).json({success: false});}
        res.status(200).json({
            success: true,
            data: hotel
        });
    } catch (err) {
        // console.log(err)
        return res.status(400).json({success: false});
    }

}

//@desc Delete single hotel
//@route DELETE /api/v1/hotels/:id
//@access Private
exports.deleteHotel = async (req,res,next) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);

        if(!hotel){
            return res.status(400).json({
                success:false
            });
        }
        res.status(200).json({
            success: true,
            data: {}
        });

    } catch(err) {
        return res.status(400).json({success: false});
    }
} 