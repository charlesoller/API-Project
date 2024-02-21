'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.hasMany(
        models.SpotImage,
        {
          foreignKey: 'spotId'
        }
      )

      Spot.hasMany(
        models.Review,
        {
          foreignKey: 'spotId'
        }
      )

      Spot.hasMany(
        models.Booking,
        {
          foreignKey: 'spotId'
        }
      )

      Spot.belongsTo(
        models.User,
        {
          as: "Owner",
          foreignKey: 'ownerId',
        }
      )
    }
  }
  Spot.init({
    ownerId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT,
    numReviews: DataTypes.INTEGER,
    avgRating: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
