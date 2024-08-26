"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("electoral_districts", {
      district_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      number_of_seats: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Female_seat: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      blankVotes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      Circassian_or_Chechen_seat: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      Christian_seat: {
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("electoral_districts");
  },
};
