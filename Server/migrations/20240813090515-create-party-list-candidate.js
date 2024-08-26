"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("party_list_candidates", {
      candidate_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      national_id: {
        type: Sequelize.STRING(20),
        references: {
          model: "users",
          key: "national_id",
        },
      },
      party_list_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "party_lists",
          key: "list_id",
        },
      },
      rank: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable("party_list_candidates");
  },
};
