"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("debate_participants", {
      debate_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "debates",
          key: "debate_id",
        },
        primaryKey: true,
      },
      candidate_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "candidates",
          key: "candidate_id",
        },
        primaryKey: true,
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
    await queryInterface.dropTable("debate_participants");
  },
};
