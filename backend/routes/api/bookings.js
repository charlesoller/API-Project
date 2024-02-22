const express = require('express')
const { Op } = require('sequelize');

const { Booking, Spot, SpotImage } = require('../../db/models');
const router = express.Router();


/* ==============================================================================================================
                                                GET ROUTES
============================================================================================================== */

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

/* ==============================================================================================================
                                                PUT ROUTES
============================================================================================================== */

// Update a booking
router.put("/:bookingId", async(req, res) => {
    const { startDate, endDate } = req.body
    const err = {message: "Bad Request"};
    const errors = {};

    if(Date.parse(startDate) < Date.now()){
        errors.startDate = "startDate cannot be in the past"
    }
    if(startDate === endDate || Date.parse(endDate) < Date.parse(startDate)){
        errors.endDate = "endDate cannot be on or before startDate"
    }

    const { bookingId } = req.params
    const userId = req.user?.id
    const booking = await Booking.findByPk(bookingId)
    if(booking.endDate < Date.now()){
        return res.status(403).json({ message: "Past bookings can't be modified"})
    }
    if(!booking){
        return res.status(404).json({ message: "Booking couldn't be found" })
    }
    if(!userId || userId !== booking.userId){
        return res.status(404).json({ message: "You are not authorized to edit this booking." })
    }

    const spot = await Spot.findByPk(booking.spotId, {
        include: {
            model: Booking,
            where: { spotId: booking.spotId }
        },
    })

    const bookings = spot.dataValues.Bookings
    for(let i = 0; i < bookings.length; i++){
        const currBooking = bookings[i].dataValues
        const sd = currBooking.startDate.toISOString().split("T")[0]
        const ed = currBooking.endDate.toISOString().split("T")[0]
        if(
            sd === startDate
            || sd === endDate
            || (Date.parse(startDate) < Date.parse(ed) && Date.parse(startDate) > Date.parse(sd))
        ){
            err.message = "Sorry, this spot is already booked for the specified dates"
            errors.startDate = "Start date conflicts with an existing booking"
        }
        if(
            ed === endDate
            || ed === startDate
            || (Date.parse(endDate) < Date.parse(ed) && Date.parse(endDate) > Date.parse(sd))
        ){
            err.message = "Sorry, this spot is already booked for the specified dates"
            errors.endDate = "End date conflicts with an existing booking"
        }
    }

    if(errors.endDate || errors.startDate){
        err.errors = errors
        return res.status(403).json(err)
    }

    booking.set({userId, spotId: booking.spotId, startDate, endDate})
    await booking.save()
    return res.json(booking)
})

/* ==============================================================================================================
                                                DELETE ROUTES
============================================================================================================== */

// Delete a Spot
router.delete("/:bookingId", async (req, res) => {
    const { bookingId } = req.params
    const userId = req.user?.id
    const booking = await Booking.findByPk(bookingId)

    if(!booking){
        return res.status(404).json({ message: "Booking couldn't be found" })
    }

    const spot = await Spot.findByPk(booking.spotId)
    if(!userId || ( booking.userId !== userId && spot.ownerId !== userId )){
        return res.status(404).json({ message: "You are not authorized to delete this booking." })
    }

    if(booking.startDate < Date.now()){
        return res.status(403).json({ message: "Bookings that have been started can't be deleted" })
    }

    await booking.destroy()
    res.json({ message: "Successfully deleted"})
})

module.exports = router;
