const express = require('express')
const { Op } = require('sequelize');

const { ReviewImage, Review } = require('../../db/models');
const router = express.Router();

/* ==============================================================================================================
                                                GET ROUTES
============================================================================================================== */

// Get all Review Images
router.get("/", async(req, res) => {
    const reviewImages = await ReviewImage.findAll();

    return res.json(reviewImages)
})

/* ==============================================================================================================
                                               DELETE ROUTES
============================================================================================================== */

// Delete a Review Image
router.delete("/:reviewImageId", async(req, res) => {
    const { reviewImageId } = req.params
    const userId = req.user?.id
    if(!userId){
        return res.status(401).json({ message: "Authentication required" })
    }
    const reviewImage = await ReviewImage.findByPk(reviewImageId)
    if(!reviewImage){
        return res.status(404).json({ message: "Review Image couldn't be found" })
    }
    const review = await Review.findByPk(reviewImage.reviewId)
    if(userId !== review.userId){
        return res.status(403).json({ message: "Forbidden"})
    }
    if(!review){
        return res.status(404).json({ message: "Review couldn't be found" })
    }




    await reviewImage.destroy()
    res.json({ message: "Successfully deleted"})
})
module.exports = router;
