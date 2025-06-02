const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DetailTransaksi = sequelize.define(
  "detail_transaksi",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    transaksi_id: DataTypes.UUID,
    produk_id: DataTypes.UUID,
    jumlah: DataTypes.INTEGER,
    harga_satuan: DataTypes.DECIMAL(10, 2),
    subtotal: DataTypes.DECIMAL(10, 2),
  },
  {
    timestamps: false,
  }
);

module.exports = DetailTransaksi;
