const express = require('express')
const { Op } = require('sequelize');

const { Spot } = require('../../db/models');
const router = express.Router();

// Get all Spots
router.get("/", async(req, res) => {
    const spots = await Spot.findAll({
        attributes: []
    });

    return res.json(spots)
})

module.exports = router;
