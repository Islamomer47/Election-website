// models/chat.js

"use strict";
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define(
    "Chat",
    {
      userMessage: DataTypes.STRING,
      botResponse: DataTypes.STRING,
    },
    {}
  );
  Chat.associate = function (models) {
    // associations can be defined here
  };
  return Chat;
};
