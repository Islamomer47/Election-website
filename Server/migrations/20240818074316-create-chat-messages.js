"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("chat_messages", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.STRING,
        references: {
          model: "users", // Adjust to match the actual table name for users
          key: "national_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      admin_id: {
        type: Sequelize.INTEGER, // Ensure this matches the Admin model
        references: {
          model: "admin", // Ensure this matches the table name exactly
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("chat_messages");
  },
};
