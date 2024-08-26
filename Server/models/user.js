// models/user.js

"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.ElectoralDistrict, { foreignKey: "district_id" });
      User.hasOne(models.Candidate, { foreignKey: "national_id" });
      User.hasOne(models.PartyListCandidate, { foreignKey: "national_id" });
      User.hasMany(models.Advertisement, { foreignKey: "national_id" });
      User.hasMany(models.ContactUsMessage, { foreignKey: "national_id" });
      User.hasMany(models.Advertisement, {
        foreignKey: "national_id",
        as: "advertisements",
      });
    }

    async comparePassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    static async getVotedLocalPercentage() {
      try {
        const totalUsers = await User.count();
        const votedLocalUsers = await User.count({
          where: {
            is_voted_local: true,
          },
        });

        if (totalUsers === 0) return 0;

        return (votedLocalUsers / totalUsers) * 100;
      } catch (error) {
        console.error("Error calculating voted local percentage:", error);
        throw error;
      }
    }
  }

  User.init(
    {
      national_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_type: {
        type: DataTypes.ENUM("voter", "candidate", "admin"),
        allowNull: false,
      },
      district_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_voted_local: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_voted_party: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_commissioner: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );

  User.beforeSave(async user => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  return User;
};
