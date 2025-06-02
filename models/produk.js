const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Produk = sequelize.define(
  "produk",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: DataTypes.UUID,
    nama_produk: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    harga: DataTypes.DECIMAL(10, 2),
    stok: DataTypes.INTEGER,
    satuan: DataTypes.STRING,
    foto_url: DataTypes.TEXT,
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false,
  }
);

module.exports = Produk;
