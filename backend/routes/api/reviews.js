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

    const reviews = await Review.findAll({
        where: { userId },
        include: [
            {
                model: User,
                attributes: [ 'id', 'firstName', 'lastName' ]
            },
            {
                model: Spot,
                include: {
                    model: SpotImage,
                },
            },
            {
                model: ReviewImage,
                attributes: [ 'id', 'url' ]
            }
        ]
    })

    return res.json({Reviews: reviews})
})

module.exports = router;
