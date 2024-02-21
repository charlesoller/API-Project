const express = require('express')
const { Op } = require('sequelize');
const { Spot, SpotImage } = require('../../db/models');
const router = express.Router();
const sequelize = require('sequelize')

// Get all Spots
router.get("/", async(req, res) => {
    const spots = await Spot.findAll({
        raw: true,
        attributes: [
            'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt', 'avgRating',
            [sequelize.col('SpotImages.url'), 'previewImage']
        ],
        include: {
            model: SpotImage,
            where: {
                spotId: sequelize.col('spot.id'),
                preview: true
            },
            required: true,
            attributes: []
        },
    });

    return res.json(spots)
})

module.exports = router;
