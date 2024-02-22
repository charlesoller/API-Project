const express = require('express')
const { Op } = require('sequelize');
const sequelize = require('sequelize');

const { Review, User, Spot, ReviewImage, SpotImage } = require('../../db/models');
const router = express.Router();


/* ==============================================================================================================
                                                GET ROUTES
============================================================================================================== */

//Get all Reviews
router.get("/", async(req, res) => {
    const reviews = await Review.findAll();

    return res.json(reviews)
})

//Get reviews of current user
router.get("/current", async(req, res) => {
    const userId = req.user?.id
    if(!userId){
        return res.status(400).json({message: "Must be logged in see your reviews."})
    }

    const reviews = await Review.findAll({
        where: { userId },
        include: [
            {
                model: User,
                attributes: [ 'id', 'firstName', 'lastName' ]
            },
            {
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
            {
                model: ReviewImage,
                attributes: [ 'id', 'url' ]
            }
        ],
    })

    // This is absolutely disgusting but it does work to pull the previewImage url out from the nested object
    const url = reviews[0].Spot.dataValues.SpotImages[0].dataValues.url
    delete reviews[0].Spot.dataValues.SpotImages
    reviews[0].Spot.dataValues.previewImage = url
    // ------------------------------------------

    return res.json({Reviews: reviews})
})

/* ==============================================================================================================
                                                POST ROUTES
============================================================================================================== */

// Add image to a review
router.post("/:id/images", async(req, res) => {
    const userId = req.user?.id
    const { id } = req.params
    const { url } = req.body

    const review = await Review.findByPk(id, {raw: true})
    if(!review){
        return res.status(404).json({ message: "Review couldn't be found"})
    }

    const currReviewImages = await ReviewImage.findAll({
        where: { reviewId: id },
        raw: true
    })
    if(currReviewImages.length >= 10){
        return res.status(403).json({ message: "Maximum number of images for this resource was reached"})
    }

    if(!userId || review.userId !== userId){
        return res.status(404).json({ message: "You are not authorized to update this review." })
    }

    const reviewImage = await ReviewImage.create({
        reviewId: id,
        url: url
    })

    return res.json({
        id: reviewImage.id,
        url: reviewImage.url
    })
})

/* ==============================================================================================================
                                                PUT ROUTES
============================================================================================================== */

router.put("/:id", async(req, res) => {
    const userId = req.user?.id
    const { id } = req.params
    const { review, stars } = req.body

    const review = Review.findByPk(id)
})

module.exports = router;
