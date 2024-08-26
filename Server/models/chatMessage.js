// models/chatMessage.js

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ChatMessage extends Model {
    static associate(models) {
      ChatMessage.belongsTo(models.User, { foreignKey: "user_id" });
      ChatMessage.belongsTo(models.Admin, { foreignKey: "admin_id" });
    }
  }

  ChatMessage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.STRING,
        references: {
          model: "User", // User model's name
          key: "national_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      admin_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Admin", // Admin model's name
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "ChatMessage",
      tableName: "chat_messages",
      timestamps: true,
    }
  );

  return ChatMessage;
};
