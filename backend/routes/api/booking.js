const express = require('express')
const { Op } = require('sequelize');

const { Booking } = require('../../db/models');
const router = express.Router();

// Get all Bookings
router.get("/", async(req, res) => {
    const bookings = await Booking.findAll();

    return res.json(bookings)
})

module.exports = router;
