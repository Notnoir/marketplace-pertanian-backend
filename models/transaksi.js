const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Transaksi = sequelize.define(
  "transaksi",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: DataTypes.UUID,
    tanggal: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    total_harga: DataTypes.DECIMAL(10, 2),
    status: DataTypes.ENUM("MENUNGGU", "DIPROSES", "SELESAI", "DIBATALKAN"),
    alamat_pengiriman: DataTypes.TEXT,
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false,
  }
);

module.exports = Transaksi;
