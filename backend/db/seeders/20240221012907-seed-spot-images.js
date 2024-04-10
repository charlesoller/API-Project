'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "https://as2.ftcdn.net/v2/jpg/05/40/56/13/1000_F_540561339_Urm75EthLbSQZHXBmtWw7hQ2x85JGyUw.jpg",
        preview: true
      },
      {
        spotId: 2,
        url: "https://www.verywellmind.com/thmb/Sef7Zg3i77uS9PeBKqFwVF_zy80=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/low-angle-view-of-building-against-cloudy-sky-750507801-5bc50e0b46e0fb0058c9ef64.jpg",
        preview: true
      },
      {
        spotId: 3,
        url: "https://wp.zillowstatic.com/trulia/wp-content/uploads/sites/1/2018/07/Alabama-4bbfb1-e1532366504796.jpg",
        preview: true
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
