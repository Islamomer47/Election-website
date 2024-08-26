"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("advertisements", {
      ad_id: {
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
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      election_slogan: {
        type: Sequelize.STRING,
      },
      design_type: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      personal_image: {
        type: Sequelize.TEXT,
      },

      color_font: {
        type: Sequelize.STRING,
      },
      color_card: {
        type: Sequelize.STRING,
      },
      color_border: {
        type: Sequelize.STRING,
      },
      border_type: {
        type: Sequelize.STRING,
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      stripeChargeId: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable("advertisements");
  },
};
