"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "election_settings",
      [
        {
          setting_id: 1,
          start_date: "2024-08-16 00:00:00+03",
          end_date: "2024-08-30 00:00:00+03",
          local_threshold: 7.0,
          party_threshold: 2.5,
          createdAt: "2024-08-16 00:00:00+03",
          updatedAt: "2024-08-16 00:00:00+03",
          party_blank_vote: 0,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("election_settings", null, {});
  },
};
