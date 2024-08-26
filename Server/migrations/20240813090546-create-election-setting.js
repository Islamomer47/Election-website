"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("election_settings", {
      setting_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      start_date: {
        type: Sequelize.DATE,
      },
      end_date: {
        type: Sequelize.DATE,
      },
      local_threshold: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 7.0,
      },
      party_threshold: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 2.5,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      party_blank_vote: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("election_settings");
  },
};
