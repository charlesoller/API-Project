const express = require('express')
const { Op } = require('sequelize');

const { SpotImage, Spot } = require('../../db/models');
const router = express.Router();

/* ==============================================================================================================
                                                GET ROUTES
============================================================================================================== */

// Get all Spot Images
router.get("/", async(req, res) => {
    const spotImages = await SpotImage.findAll();

    return res.json(spotImages)
})

/* ==============================================================================================================
                                                DELETE ROUTES
============================================================================================================== */

// Delete a spot image
router.delete("/:spotImageId", async(req, res) => {
    const { spotImageId } = req.params
    const userId = req.user?.id
    const spotImage = await SpotImage.findByPk(spotImageId)
    if(!spotImage){
        return res.status(404).json({ message: "Spot Image couldn't be found" })
    }
    const spot = await Spot.findByPk(spotImage.spotId)

    if(!userId || userId !== spot.ownerId){
        return res.status(404).json({ message: "You are not authorized to delete this spot image." })
    }

    await spotImage.destroy()
    res.json({ message: "Successfully deleted"})
})
module.exports = router;
