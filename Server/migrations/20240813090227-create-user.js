"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      national_id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      full_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      user_type: {
        type: Sequelize.ENUM("voter", "candidate"),
        allowNull: false,
      },
      district_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "electoral_districts",
          key: "district_id",
        },
      },
      is_voted_local: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_voted_party: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      is_commissioner: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};
