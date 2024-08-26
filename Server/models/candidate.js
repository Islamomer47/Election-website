"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Candidate extends Model {
    static associate(models) {
      Candidate.belongsTo(models.User, { foreignKey: "national_id" });
      Candidate.belongsTo(models.LocalList, { foreignKey: "list_id" });
      Candidate.belongsToMany(models.Debate, {
        through: models.DebateParticipant,
        foreignKey: "candidate_id",
        otherKey: "debate_id",
      });
    }
  }

  Candidate.init(
    {
      candidate_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      national_id: {
        type: DataTypes.STRING(20),
        references: {
          model: "users",
          key: "national_id",
        },
        allowNull: false,
      },
      list_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "local_lists",
          key: "list_id",
        },
        allowNull: true,
      },
      votes: DataTypes.INTEGER,
      religion: DataTypes.ENUM(
        "Muslim",
        "Christian",
        "circassian_chechen",
        "female_quota"
      ),
      gender: DataTypes.ENUM("Male", "Female"),
    },
    {
      sequelize,
      modelName: "Candidate",
      tableName: "candidates",
    }
  );

  return Candidate;
};
