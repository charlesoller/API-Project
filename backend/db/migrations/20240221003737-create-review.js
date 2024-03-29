'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id"
        },
        allowNull: false
      },
      spotId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Spots",
          key: "id"
        },
        onDelete: "CASCADE",
        allowNull: false
      },
      review: {
        type: Sequelize.STRING,
        allowNull: false
      },
      stars: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, options);
    options.tableName = "Reviews"
    await queryInterface.addIndex(options, ['userId', 'spotId'], { unique: true })
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews"
    await queryInterface.dropTable(options);
  }
};
