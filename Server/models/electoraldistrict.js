"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ElectoralDistrict extends Model {
    static associate(models) {
      ElectoralDistrict.hasMany(models.User, { foreignKey: "district_id" });
      ElectoralDistrict.hasMany(models.LocalList, {
        foreignKey: "district_id",
      });
    }
  }
  ElectoralDistrict.init(
    {
      district_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING(100),
      city: DataTypes.STRING(50),
      number_of_seats: DataTypes.INTEGER,
      Female_seat: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      Circassian_or_Chechen_seat: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      Christian_seat: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      blankVotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "ElectoralDistrict",
      tableName: "electoral_districts", // Ensure this matches the table name in the migration
      timestamps: true, // Assuming createdAt and updatedAt columns are managed by Sequelize
    }
  );
  return ElectoralDistrict;
};
