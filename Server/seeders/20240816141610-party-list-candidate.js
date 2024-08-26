"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("party_list_candidates", [
      {
        national_id: "123456789012",
        party_list_id: 1,
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        national_id: "123456789013",
        party_list_id: 1,
        rank: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        national_id: "123456789014",
        party_list_id: 2,
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        national_id: "123456789015",
        party_list_id: 2,
        rank: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        national_id: "123456789016",
        party_list_id: 3,
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        national_id: "123456789017",
        party_list_id: 3,
        rank: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        national_id: "123456789018",
        party_list_id: 4,
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        national_id: "123456789019",
        party_list_id: 4,
        rank: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("party_list_candidates", null, {});
  },
};
