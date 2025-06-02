const sequelize = require("../config/database");
const User = require("./user");
const Produk = require("./produk");
const Transaksi = require("./transaksi");
const DetailTransaksi = require("./detailTransaksi");

// Relasi
User.hasMany(Produk, { foreignKey: "user_id" });
Produk.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Transaksi, { foreignKey: "user_id" });
Transaksi.belongsTo(User, { foreignKey: "user_id" });

Transaksi.hasMany(DetailTransaksi, { foreignKey: "transaksi_id" });
DetailTransaksi.belongsTo(Transaksi, { foreignKey: "transaksi_id" });

Produk.hasMany(DetailTransaksi, { foreignKey: "produk_id" });
DetailTransaksi.belongsTo(Produk, { foreignKey: "produk_id" });

module.exports = { sequelize, User, Produk, Transaksi, DetailTransaksi };
