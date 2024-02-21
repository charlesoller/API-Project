const express = require('express')
const { Op } = require('sequelize');

const { SpotImage } = require('../../db/models');
const router = express.Router();

// Get all Spot Images
router.get("/", async(req, res) => {
    const spotImages = await SpotImage.findAll();

    return res.json(spotImages)
})

module.exports = router;
