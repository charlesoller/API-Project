const express = require('express')
const { Op } = require('sequelize');
const { Spot, SpotImage, User } = require('../../db/models');
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

    return res.json({Spots: spots})
})

// Get Spots of Current User
router.get("/current", async(req, res) => {
    try {
        const { id } = req.user
        const spots = await Spot.findAll({
            raw: true,
            where: {ownerId: id},
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

        return res.json({Spots: spots})
    } catch {
        return res.json({
            message: "Must be logged in to view current user's spots"
        })
    }
})

// Get Details of a Spot by Id
router.get("/:id", async(req, res) => {
    const { id } = req.params;
    const spot = await Spot.findOne({
        where: { id },
        attributes: [
            'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt', 'numReviews',
            ['avgRating', 'avgStarRating']],
        include: [
            {
                model: SpotImage,
                attributes: {
                    exclude: ['spotId', 'createdAt', 'updatedAt']
                },
                where: {
                    spotId: sequelize.col('spot.id')
                }
            },
            {
                model: User,
                as: "Owner",
                attributes: {
                    exclude: ['username', 'email', 'hashedPassword', 'createdAt', 'updatedAt']
                },
                where: {
                    id: sequelize.col('spot.ownerId')
                }
            }
        ]
    })
    if(!spot){
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    return res.json(spot)
})

router.get("/", async(req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const user = await Spot.create({ email, username, firstName, lastName, hashedPassword });
})

module.exports = router;
