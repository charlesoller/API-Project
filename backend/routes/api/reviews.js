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



module.exports = router;
