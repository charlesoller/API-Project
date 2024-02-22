'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        userId: 1,
        spotId: 1,
        startDate: "2023-01-20 23:56:12.157 +00:00",
        endDate: "2023-02-20 23:56:12.157 +00:00"
      },
      {
        userId: 3,
        spotId: 2,
        startDate: "2023-06-10 23:56:12.157 +00:00",
        endDate: "2023-06-17 23:56:12.157 +00:00"
      },
      {
        userId: 2,
        spotId: 3,
        startDate: "2024-01-20 23:56:12.157 +00:00",
        endDate: "2024-01-25 23:56:12.157 +00:00"
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
