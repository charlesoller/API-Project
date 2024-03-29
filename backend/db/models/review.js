'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.hasMany(
        models.ReviewImage,
        {
          foreignKey: 'reviewId',
          onDelete: 'CASCADE'
        }
      )

      Review.belongsTo(
        models.Spot,
        {
          foreignKey: 'spotId',
        }
      )

      Review.belongsTo(
        models.User,
        {
          foreignKey: 'userId',
        }
      )
    }
  }
  Review.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 250]
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1,
        max: 5
      }
    },
  }, {
    indexes: [
      {
        name: 'unique_index',
        unique: true,
        fields: ['userId', 'spotId' ]
      }
    ],
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
