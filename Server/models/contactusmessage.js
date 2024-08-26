"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ContactUsMessage extends Model {
    static associate(models) {
      ContactUsMessage.belongsTo(models.User, { foreignKey: "national_id" });
    }
  }
  ContactUsMessage.init(
    {
      message_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      national_id: DataTypes.STRING(20),
      message: DataTypes.TEXT,
      // timestamp: {
      //   type: DataTypes.DATE,
      //   defaultValue: DataTypes.NOW,
      // },
      // is_from_user: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "ContactUsMessage",
      tableName: "contactus_messages",
      // timestamps: true,
    }
  );
  return ContactUsMessage;
};