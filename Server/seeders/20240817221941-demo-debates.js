"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "debates",
      [
        {
          title: "Debate on Environmental Policies",
          date: new Date("2024-09-01T19:00:00Z"), // Use ISO format with timezone
          payment_amount: 500.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Debate on Economic Reforms",
          date: new Date("2024-09-15T19:00:00Z"), // Use ISO format with timezone
          payment_amount: 600.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Debate on Healthcare Systems",
          date: new Date("2024-09-30T19:00:00Z"), // Use ISO format with timezone
          payment_amount: 550.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("debates", null, {});
  },
};
