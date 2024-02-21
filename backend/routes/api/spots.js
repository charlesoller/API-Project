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

// Create a Spot
router.post("/", async(req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const id = req.user?.id
    if(!id){
        return res.status(400).json({message: "Must be logged in to create a Spot."})
    }

    try {
        const spot = await Spot.create({ ownerId: id, address, city, state, country, lat, lng, name, description, price });
        return res.json(spot)
    } catch(e) {
        const err = { message: "Bad Request" }
        const errors = {}
        e.errors.forEach(error => {
            const errItem = error.path
            switch (errItem) {
                case 'address': errors.address = "Street address is required"; break;
                case 'city': errors.city = "City is required"; break;
                case 'state': errors.state = "State is required"; break;
                case 'country': errors.country = "Country is required"; break;
                case 'lat': errors.lat = "Latitude must be within -180 and 180"; break;
                case 'lng': errors.lng = "Longitude must be within -180 and 180"; break;
                case 'name': errors.name = "Name must be less than 50 characters"; break;
                case 'description': errors.description = "Description is required"; break;
                case 'price': errors.price = "Price per day must be a positive number"; break;
                default: errors.default = "No error found. Please try again."; break;
            }
        })

        err.errors = errors
        return res.status(400).json(err)
    }
})

module.exports = router;
