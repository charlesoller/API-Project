const express = require('express')
const { Op } = require('sequelize');

const { ReviewImage } = require('../../db/models');
const router = express.Router();

// Get all Review Images
router.get("/", async(req, res) => {
    const reviewImages = await ReviewImage.findAll();

    return res.json(reviewImages)
})

module.exports = router;
