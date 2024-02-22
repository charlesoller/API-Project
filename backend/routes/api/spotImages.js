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
    if(!userId){
        return res.status(401).json({ message: "Authentication required" })
    }
    if(userId !== spot.ownerId){
        return res.status(403).json({ message: "Forbidden" })
    }

    if(!spotImage){
        return res.status(404).json({ message: "Spot Image couldn't be found" })
    }
    const spot = await Spot.findByPk(spotImage.spotId)



    await spotImage.destroy()
    res.json({ message: "Successfully deleted"})
})
module.exports = router;
