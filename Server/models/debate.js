"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Debate extends Model {
    static associate(models) {
      Debate.belongsToMany(models.Candidate, {
        through: models.DebateParticipant,
        foreignKey: "debate_id",
        otherKey: "candidate_id",
      });
    }
  }

  Debate.init(
    {
      debate_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      payment_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Debate",
      tableName: "debates",
      primaryKey: "debate_id",
    }
  );

  return Debate;
};
