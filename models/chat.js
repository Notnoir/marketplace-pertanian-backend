const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Chat = sequelize.define(
  "chat",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sender_id: DataTypes.UUID,
    receiver_id: DataTypes.UUID,
    message: DataTypes.TEXT,
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false,
  }
);

module.exports = Chat;
