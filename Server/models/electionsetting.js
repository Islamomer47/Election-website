"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ElectionSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ElectionSetting.init(
    {
      setting_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      local_threshold: DataTypes.DECIMAL,
      party_threshold: DataTypes.DECIMAL,
      party_blank_vote: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ElectionSetting",
      tableName: "election_settings",
    }
  );
  return ElectionSetting;
};
