const express = require('express')
const { Op } = require('sequelize');
const { Spot, SpotImage, User, Review, ReviewImage } = require('../../db/models');
const router = express.Router();
const sequelize = require('sequelize');
const spot = require('../../db/models/spot');

/* ==============================================================================================================
                                                GET ROUTES
============================================================================================================== */

// Get all Spots
router.get("/", async(req, res) => {
    const spots = await Spot.findAll({
        raw: true,
        //The inclusion of all attributes as seen below is necessary for getting rid of the model name of SpotImages in the response
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

// Get All Reviews by Spot Id
router.get("/:id/reviews", async(req, res) => {
    const { id } = req.params

    const reviews = await Review.findAll({
        where: {
            spotId: id
        },
        include: [
            {
                model: User,
                attributes: [ 'id', 'firstName', 'lastName' ]
            },
            {
                model: ReviewImage,
                attributes: [ 'id', 'url' ]
            }
        ]
    })

    if(!reviews.length){
        return res.status(404).json({message: "Spot couldn't be found"})
    }

    return res.json(reviews)
})

/* ==============================================================================================================
                                                POST ROUTES
============================================================================================================== */

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

// Add Image to a Spot
router.post("/:id/images", async(req, res) => {
    const { url, preview } = req.body
    const { id } = req.params
    const userId = req.user?.id
    const spot = await Spot.findByPk(id, { raw: true })

    if(!spot){
        return res.status(404).json({ message: "Spot couldn't be found" })
    }

    if(!userId || spot.ownerId !== userId){
        return res.status(404).json({ message: "You are not authorized to add an image to this spot." })
    }

    const spotImage = await SpotImage.create({ spotId: id, url, preview })
    return res.json({
        id: spotImage.id,
        url: spotImage.url,
        preview: spotImage.preview
    })
})

// Create a review for a spot
router.post("/:id/reviews", async(req, res) => {
    const { review, stars } = req.body

    const userId = req.user.id
    const spotId = req.params.id

    const spot = await Spot.findByPk(spotId)
    if(!spot){
        return res.status(404).json({message: "Spot couldn't be found"})
    }

    try {
        const newReview = await Review.create({ spotId, userId, review, stars })
        const newRating = (spot.avgRating * spot.numReviews + stars) / (spot.numReviews + 1)

        // Updating spot to reflect new review
        spot.set({
            numReviews: spot.numReviews + 1,
            avgRating: Number(newRating.toFixed(2))
        })
        await spot.save()

        return res.json({
            review: newReview.review,
            stars: newReview.stars
        })
    } catch (e) {
        const err = { message: "Bad Request" }
        const errors = {}
        e.errors.forEach(error => {
            const errItem = error.path
            switch (errItem) {
                case 'stars': errors.stars = "Stars must be an integer from 1 to 5"; break;
                case 'review': errors.city = "Review text is required"; break;
                default: errors.default = "No error found. Please try again."; break;
            }
        })

        err.errors = errors
        return res.status(400).json(err)
    }
})

/* ==============================================================================================================
                                                PUT ROUTES
============================================================================================================== */

// Update a spot
router.put("/:id", async(req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const { id } = req.params
    const userId = req.user?.id
    const spot = await Spot.findByPk(id)

    if(!spot){
        return res.status(404).json({ message: "Spot couldn't be found" })
    }

    if(!userId || spot.ownerId !== userId){
        return res.status(404).json({ message: "You are not authorized to update this spot." })
    }

    try {
        spot.set({
            address, city, state, country, lat, lng, name, description, price
        })
        await spot.save()
        return res.json({
            // This is to exclude numReviews and avgRating
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt
        })

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

/* ==============================================================================================================
                                               DELETE ROUTES
============================================================================================================== */

// Delete a Spot
router.delete("/:id", async (req, res) => {
    const { id } = req.params
    const userId = req.user?.id
    const spot = await Spot.findByPk(id)

    if(!spot){
        return res.status(404).json({ message: "Spot couldn't be found" })
    }

    if(!userId || spot.ownerId !== userId){
        return res.status(404).json({ message: "You are not authorized to delete this spot." })
    }

    await spot.destroy()
    res.json({ message: "Successfully deleted"})
})

module.exports = router;
