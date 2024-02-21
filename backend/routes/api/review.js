const express = require('express')
const { Op } = require('sequelize');

const { Review } = require('../../db/models');
const router = express.Router();

// Get all Reviews
router.get("/", async(req, res) => {
    const reviews = await Review.findAll();

    return res.json(reviews)
})

module.exports = router;
