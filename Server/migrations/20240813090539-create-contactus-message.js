"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("contactus_messages", {
      message_id: {
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
      message: {
        type: Sequelize.TEXT,
      },
      // timestamp: {
      //   type: Sequelize.DATE,
      //   defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      // },
      is_from_user: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("contactus_messages");
  },
};