"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PartyListCandidate extends Model {
    static associate(models) {
      PartyListCandidate.belongsTo(models.User, { foreignKey: "national_id" });
      PartyListCandidate.belongsTo(models.PartyList, {
        foreignKey: "party_list_id",
      });
    }
  }
  PartyListCandidate.init(
    {
      candidate_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rank: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PartyListCandidate",
      tableName: "party_list_candidates",
    }
  );
  return PartyListCandidate;
};
