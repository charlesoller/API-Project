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
        ownerId: 1,
        address: "123 Candy Lane",
        city: "Candy Land",
        state: "Candy World",
        lat: 40.44,
        lng: 32.45,
        name: "Candy Castle",
        description: "The Sweetest Place on Earth",
        price: 401.89,
        numReviews: 2,
        avgRating: 4.6
      },
      {
        ownerId: 3,
        address: "555 Scary Lane",
        city: "Transylvania",
        state: "Oklahoma",
        lat: 33.33,
        lng: 33.33,
        name: "Haunted House",
        description: "The Most Haunted Place on Earth",
        price: 10.00,
        numReviews: 5,
        avgRating: 2.2
      },
      {
        ownerId: 2,
        address: "456 Modest Way",
        city: "Normal",
        state: "Nebraska",
        lat: 23.45,
        lng: 67.43,
        name: "Average Home",
        description: "The Most Average Place on Earth",
        price: 100.50,
        numReviews: 3,
        avgRating: 4.1
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Candy Castle', 'Haunted House', 'Average Home'] }
    }, {});
  }
};
