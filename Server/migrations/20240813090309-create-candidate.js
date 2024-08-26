"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("candidates", {
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
      list_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "local_lists",
          key: "list_id",
        },
      },
      votes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      religion: {
        type: Sequelize.ENUM(
          "Muslim",
          "Christian",
          "circassian_chechen",
          "female_quota"
        ),
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM("Male", "Female"),
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
    await queryInterface.dropTable("candidates");
  },
};
