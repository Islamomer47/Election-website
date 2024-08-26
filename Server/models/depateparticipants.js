"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DebateParticipant extends Model {
    static associate(models) {
      DebateParticipant.belongsTo(models.Debate, { foreignKey: "debate_id" });
      DebateParticipant.belongsTo(models.Candidate, {
        foreignKey: "candidate_id",
      });
    }
  }

  DebateParticipant.init(
    {
      debate_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      candidate_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "DebateParticipant",
      tableName: "debate_participants",
    }
  );

  return DebateParticipant;
};
