const express = require('express')
const { Op } = require('sequelize');

const { Booking, Spot, SpotImage } = require('../../db/models');
const router = express.Router();

// Get all Bookings
router.get("/", async(req, res) => {
    const bookings = await Booking.findAll();

    return res.json(bookings)
})

// Get all of Current User's Bookings
router.get("/current", async(req, res) => {
    const userId = req.user?.id
    if(!userId){
        return res.status(400).json({message: "Must be logged in see your reviews."})
    }

    const bookings = await Booking.findAll({
        where: { userId },
        include: {
            model: Spot,
            attributes: [
                'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price',
            ],
            include: {
                model: SpotImage,
                where: {
                    preview: true
                },
            },
        },
    })

    // This is absolutely disgusting but it does work to pull the previewImage url out from the nested object
    for(let i = 0; i < bookings.length; i++){
        const url = bookings[i].Spot.dataValues.SpotImages[i].dataValues.url
        delete bookings[i].Spot.dataValues.SpotImages
        bookings[i].Spot.dataValues.previewImage = url
    }

    // ------------------------------------------

    return res.json({Bookings: bookings})
})

module.exports = router;
