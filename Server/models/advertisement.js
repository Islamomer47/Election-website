// models/advertisement.js
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Advertisement extends Model {
    static associate(models) {
      Advertisement.belongsTo(models.User, {
        foreignKey: "national_id",
        as: "user",
      });
    }
  }

  Advertisement.init(
    {
      ad_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      national_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: "users",
          key: "national_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      election_slogan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      design_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      personal_image: {
        type: DataTypes.TEXT,
      },
      color_font: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color_card: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color_border: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      border_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
      },
      stripeChargeId: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Advertisement",
      tableName: "advertisements",
      timestamps: true,
    }
  );

  return Advertisement;
};
