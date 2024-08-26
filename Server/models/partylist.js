"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PartyList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Association with the PartyListCandidate model
      PartyList.hasMany(models.PartyListCandidate, {
        foreignKey: "party_list_id",
      });
    }
  }

  PartyList.init(
    {
      list_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      is_approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
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
      modelName: "PartyList",
      tableName: "party_lists",
    }
  );

  return PartyList;
};
