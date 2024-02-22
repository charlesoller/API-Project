const express = require('express')
const { Op } = require('sequelize');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const router = express.Router();
const sequelize = require('sequelize');
const spot = require('../../db/models/spot');

/* ==============================================================================================================
                                                GET ROUTES
============================================================================================================== */

// Get all Spots
router.get("/", async(req, res) => {

    const query = {};
    const where = {};
    let { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query
    const err = {message: "Bad Request"}
    const errors = {}

    // PARSING QUERY ==============================
    if(minLat) minLat = parseInt(minLat)
    if(maxLat) maxLat = parseInt(maxLat)
    if(minLng) minLng = parseInt(minLng)
    if(maxLng) maxLng = parseInt(maxLng)
    if(minPrice) minPrice = parseInt(minPrice)
    if(maxPrice) maxPrice = parseInt(maxPrice)

    // ============================================
    // PAGINATION =================================
    let page = req.query.page === undefined ? 1 : parseInt(req.query.page);
    let size = req.query.size === undefined ? 20 : parseInt(req.query.size);
    if(typeof page !== "number" || page < 1) {
        errors.page = "Page must be greater than or equal to 1"
    }
    if(typeof size !== "number" || size < 1) {
        errors.size = "Size must be greater than or equal to 1"
    }

    query.limit = size;
    query.offset = size * (page - 1);
    // ============================================
    // BUILDING WHERE ==============================
    // CHECK LAT -----------------------------------
    if(maxLat && maxLat >= -90 && maxLat <= 90){
        where.maxLat = maxLat
    } else if (maxLat){
        errors.maxLat = "Maxiumum latitude is invalid"
    }
    if(minLat && minLat >= -90 && minLat <= 90){
        where.minLat = minLat
    } else if (minLat){
        errors.minLat = "Minimum latitude is invalid"
    }
    // CHECK LNG -----------------------------------
    if(maxLng && maxLng >= -180 && maxLng <= 180){
        where.maxLng = maxLng
    } else if (maxLng) {
        errors.maxLng = "Maxiumum longitude is invalid"
    }
    if(minLng && minLng >= -180 && minLng <= 180){
        where.minLng = minLng
    } else if (minLng) {
        errors.minLng = "Minimum longitude is invalid"
    }
    // CHECK PRICE -----------------------------------
    if(minPrice && minPrice >= 0){
        where.minPrice = minPrice
    } else if (minPrice){
        errors.minPrice = "Minimum price must be greater than or equal to 0"
    }
    if(maxPrice && maxPrice >= 0){
        where.maxPrice = maxPrice
    } else if(maxPrice) {
        errors.maxPrice = "Maximum price must be greater than or equal to 0"
    }
    //===================================================
    // BUILDING FILTER ==================================
    const filter = {}
    // Setting up Lat filter
    if(where.minLat && where.maxLat){
        filter.lat = {
            [Op.between]: [where.minLat, where.maxLat]
        }
    } else if (where.minLat){
        filter.lat = {
            [Op.gt]: where.minLat
        }
    } else if (where.maxLat){
        filter.lat = {
            [Op.lt]: where.maxLat
        }
    }
    //Setting up Lng filter
    if(where.minLng && where.maxLng){
        filter.lng = {
            [Op.between]: [where.minLng, where.maxLng]
        }
    } else if (where.minLng){
        filter.lng = {
            [Op.gt]: where.minLng
        }
    } else if (where.maxLng){
        filter.lng = {
            [Op.lt]: where.maxLng
        }
    }
    //Setting up price filter
    if(where.minPrice && where.maxPrice){
        filter.price = {
            [Op.between]: [where.minPrice, where.maxPrice]
        }
    } else if (where.minPrice){
        filter.price = {
            [Op.gt]: where.minPrice
        }
    } else if (where.maxPrice){
        filter.price = {
            [Op.lt]: where.maxPrice
        }
    }
    //===================================================

    const spots = await Spot.findAll({
        // raw: true,
        //The inclusion of all attributes as seen below is necessary for getting rid of the model name of SpotImages in the response
        where: filter,
        // ...query,

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

    if(Object.keys(errors).length){
        err.errors = errors
        return res.status(400).json(err)
    }

    return res.json({Spots: spots, page, size})
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

// Get All Bookings by Spot Id
router.get("/:id/bookings", async(req, res) => {
    const { id } = req.params
    const userId = req.user?.id
    if(!userId){
        return res.status(400).json({message: "Must be logged in to view bookings."})
    }

    const spot = await Spot.findByPk(id, { raw: true })
    if(!spot){
        return res.status(404).json({message: "Spot couldn't be found"})
    }

    if(userId === spot.ownerId){
        const bookings = await Booking.findAll({
            where: {
                spotId: id
            },
            include: {
                model: User,
                attributes: [ 'id', 'firstName', 'lastName' ]
            },
        })

        return res.json({Bookings: bookings})
    } else {
        const bookings = await Booking.findAll({
            where: {
                spotId: id
            },
            attributes: ['spotId', 'startDate', 'endDate']
        })

        return res.json({Bookings: bookings})
    }
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

        return res.json(newReview)
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

// Post a booking
router.post("/:id/bookings", async(req, res) => {
    const { startDate, endDate } = req.body
    const { id } = req.params
    const userId = req.user?.id
    const spot = await Spot.findByPk(id, {
        include: {
            model: Booking,
            where: { spotId: id }
        },
    })
    if(!spot){
        return res.status(404).json({ message: "Spot couldn't be found" })
    }
    const err = {message: "Bad Request"};
    const errors = {};

    const bookings = spot.dataValues.Bookings
    for(let i = 0; i < bookings.length; i++){
        const booking = bookings[i].dataValues
        const sd = booking.startDate.toISOString().split("T")[0]
        const ed = booking.endDate.toISOString().split("T")[0]
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


    if(Date.parse(startDate) < Date.now()){
        errors.startDate = "startDate cannot be in the past"
    }

    // Possible issue here
    if(startDate === endDate || Date.parse(endDate) < Date.parse(startDate)){
        errors.endDate = "endDate cannot be on or before startDate"
    }

    if(!userId || spot.ownerId === userId){
        return res.status(404).json({ message: "You are not authorized to create a booking for this spot." })
    }

    const booking = await Booking.create({userId, spotId: id, startDate, endDate})

    if(errors.startDate || errors.endDate){
        err.errors = errors
        return res.status(400).json(err)
    }

    return res.json(booking)
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
