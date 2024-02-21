'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        userId: 1,
        spotId: 1,
        review: "Pretty sweet place.",
        stars: 4.5
      },
      {
        userId: 3,
        spotId: 2,
        review: "It was just really scary.",
        stars: 2
      },
      {
        userId: 2,
        spotId: 2,
        review: "It was good.",
        stars: 3.5
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: { [Op.in]: ["Pretty sweet place.", "It was just really scary.", "It was good."] }
    }, {});
  }
};
