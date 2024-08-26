"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LocalList extends Model {
    static associate(models) {
      LocalList.belongsTo(models.ElectoralDistrict, {
        foreignKey: "district_id",
      });
      LocalList.hasMany(models.Candidate, { foreignKey: "list_id" });
    }
  }

  LocalList.init(
    {
      list_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      votes: DataTypes.INTEGER,
      is_approved: DataTypes.BOOLEAN,
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      district_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "electoral_districts",
          key: "district_id",
        },
      },
      votes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "LocalList",
      tableName: "local_lists",
    }
  );

  return LocalList;
};
