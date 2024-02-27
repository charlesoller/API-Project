const express = require('express')
const { Op } = require('sequelize');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const router = express.Router();
const sequelize = require('sequelize');
const spot = require('../../db/models/spot');
const { formatDate } = require('../../utils/helper');

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
    query.offset = (page - 1) * size;
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

    let spots = await Spot.findAll({
        // raw: true,
        //The inclusion of all attributes as seen below is necessary for getting rid of the model name of SpotImages in the response
        where: filter,
        ...query,
        attributes: {
            exclude: [ 'numReviews' ]
        },
        include: {
            model: SpotImage,
            attributes: ['url', 'preview']
        },
    });

    // REPLACE CODE BELOW EVENTUALLY
    for(let i = 0; i < spots.length; i++){
        if(spots[i].dataValues.SpotImages.length){
            const url = spots[i].dataValues.SpotImages[0].dataValues.url
            delete spots[i].dataValues.SpotImages
            spots[i].dataValues.previewImage = url
        } else {
            delete spots[i].dataValues.SpotImages
            spots[i].dataValues.previewImage = null
        }
    }
    // ------------------------------------------

    if(Object.keys(errors).length){
        err.errors = errors
        return res.status(400).json(err)
    }



    spots = formatDate(spots)
    return res.json({Spots: spots, page, size})
})

// Get Spots of Current User
router.get("/current", async(req, res) => {
    try {
        const { id } = req.user
        const spots = await Spot.findAll({
            where: {ownerId: id},
            attributes: [
                'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt', 'avgRating' ],
            include: {
                model: SpotImage,
                attributes: ['url', 'preview']
            },
        });

        // REPLACE CODE BELOW EVENTUALLY
        for(let i = 0; i < spots.length; i++){
            if(spots[i].dataValues.SpotImages.length){
                const url = spots[i].dataValues.SpotImages[0].dataValues.url
                delete spots[i].dataValues.SpotImages
                spots[i].dataValues.previewImage = url
            } else {
                delete spots[i].dataValues.SpotImages
                spots[i].dataValues.previewImage = null
            }
        }

        return res.json({Spots: spots})
        // SOMETHING WEIRD IN PROD HERE::::::::::::::
    } catch {
        return res.status(401).json({
            message: "Authentication required"
        })
    }
})

// Get Details of a Spot by Id
router.get("/:id", async(req, res) => {
    const { id } = req.params;
    let spot = await Spot.findOne({
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
            },
            {
                model: User,
                as: "Owner",
                attributes: {
                    exclude: ['username', 'email', 'hashedPassword', 'createdAt', 'updatedAt']
                },
            }
        ]
    })
    if(!spot){
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
    spot = formatDate(spot)
    return res.json(spot)
})

// Get All Reviews by Spot Id
router.get("/:id/reviews", async(req, res) => {
    const { id } = req.params

    const spot = await Spot.findByPk(id)
    if(!spot){
        return res.status(404).json({message: "Spot couldn't be found"})
    }

    let reviews = await Review.findAll({
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



    reviews = formatDate(reviews)
    return res.json({ Reviews: reviews })
})

// Get All Bookings by Spot Id
router.get("/:id/bookings", async(req, res) => {
    const { id } = req.params
    const userId = req.user?.id
    if(!userId){
        return res.status(401).json({message: "Authentication required"})
    }
    const spot = await Spot.findByPk(id, { raw: true })
    if(!spot){
        return res.status(404).json({message: "Spot couldn't be found"})
    }

    if(userId === spot.ownerId){
        let bookings = await Booking.findAll({
            where: {
                spotId: id
            },
            include: {
                model: User,
                attributes: [ 'id', 'firstName', 'lastName' ]
            },
        })
        bookings = formatDate(bookings)
        return res.json({Bookings: bookings})
    } else {
        let bookings = await Booking.findAll({
            where: {
                spotId: id
            },
            attributes: ['spotId', 'startDate', 'endDate']
        })
        bookings = formatDate(bookings)
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
        return res.status(401).json({message: "Authentication required"})
    }

    try {
        let spot = await Spot.create({ ownerId: id, address, city, state, country, lat, lng, name, description, price });
        delete spot.numReviews
        delete spot.avgRating   //These properties shouldn't show up in response
        spot = formatDate(spot)
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
    if(!userId){
        return res.status(401).json({ message: "Authentication required" })
    }
    if(!spot){
        return res.status(404).json({ message: "Spot couldn't be found" })
    }
    if(spot.ownerId !== userId){
        return res.status(403).json({message: "Forbidden"})
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

    const userId = req.user?.id
    if(!userId){
        return res.status(401).json({message: "Authentication required"})
    }
    const spotId = req.params.id

    const spot = await Spot.findByPk(spotId)
    if(!spot){
        return res.status(404).json({message: "Spot couldn't be found"})
    }

    try {
        let newReview = await Review.create({ spotId, userId, review, stars })
        const newRating = (spot.avgRating * spot.numReviews + stars) / (spot.numReviews + 1)

        // Updating spot to reflect new review
        spot.set({
            numReviews: spot.numReviews + 1,
            avgRating: Number(newRating.toFixed(2))
        })
        await spot.save()

        newReview = formatDate(newReview)
        return res.json(newReview)
    } catch (e) {
        const err = { message: "Bad Request" }
        const errors = {}
        e.errors.forEach(error => {
            const errItem = error.path
            switch (errItem) {
                case 'stars': errors.stars = "Stars must be an integer from 1 to 5"; break;
                case 'review': errors.city = "Review text is required"; break;
                default: errors.default = "User already has a review for this spot"; break;
            }
        })

        if(errors.default){
            return res.status(500).json({message: "User already has a review for this spot"})
        }
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
        },
    })
    if(!userId){
        return res.status(401).json({ message: "Authentication required" })
    }
    if(!spot){
        return res.status(404).json({ message: "Spot couldn't be found" })
    }
    if(spot.ownerId === userId){
        return res.status(403).json({message: "Forbidden"})
    }
    const err = {message: "Bad Request"};
    const errors = {};

    if(Date.parse(startDate) < Date.now()){
        errors.startDate = "startDate cannot be in the past"
    }

    // Possible issue here
    if(startDate === endDate || Date.parse(endDate) < Date.parse(startDate)){
        errors.endDate = "endDate cannot be on or before startDate"
    }

    if(errors.startDate || errors.endDate){
        err.errors = errors
        return res.status(400).json(err)
    }

    const bookings = spot.dataValues.Bookings
    for(let i = 0; i < bookings.length; i++){
        const booking = bookings[i].dataValues
        const sd = booking.startDate.toISOString().split("T")[0]
        const ed = booking.endDate.toISOString().split("T")[0]
        // REVISIT THESE ERRORS - may be a little bit too judicious
        if(
            startDate === sd
            || startDate === ed
            || (Date.parse(startDate) < Date.parse(ed) && Date.parse(startDate) > Date.parse(sd)) // in the middle of current booking
            || Date.parse(ed) < Date.parse(endDate) && Date.parse(sd) > Date.parse(startDate) // surrounds existing
        ){
            err.message = "Sorry, this spot is already booked for the specified dates"
            errors.startDate = "Start date conflicts with an existing booking"
        }
        if(
            endDate === ed
            || endDate === sd
            || (Date.parse(endDate) < Date.parse(ed) && Date.parse(endDate) > Date.parse(sd)) // in the middle of current start date
            || Date.parse(ed) < Date.parse(endDate) && Date.parse(sd) > Date.parse(startDate) // surrounds existing
        ){
            err.message = "Sorry, this spot is already booked for the specified dates"
            errors.endDate = "End date conflicts with an existing booking"
        }
    }

    if(errors.endDate || errors.startDate){
        err.errors = errors
        return res.status(403).json(err)
    }

    let booking = await Booking.create({userId, spotId: id, startDate, endDate})

    booking = formatDate(booking)
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
    let spot = await Spot.findByPk(id)
    if(!userId){
        return res.status(401).json({ message: "Authentication required" })
    }
    if(!spot){
        return res.status(404).json({ message: "Spot couldn't be found" })
    }
    if(spot.ownerId !== userId){
        return res.status(403).json({ message: "Forbidden" })
    }


    try {
        spot.set({
            address, city, state, country, lat, lng, name, description, price
        })
        await spot.save()
        spot = formatDate(spot)
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
    if(!userId){
        return res.status(401).json({ message: "Authentication required" })
    }
    if(!spot){
        return res.status(404).json({ message: "Spot couldn't be found" })
    }
    if(spot.ownerId !== userId){
        return res.status(403).json({ message: "Forbidden" })
    }


    await spot.destroy()
    res.json({ message: "Successfully deleted"})
})

module.exports = router;
