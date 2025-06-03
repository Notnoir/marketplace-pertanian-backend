const { Transaksi, DetailTransaksi, Produk, User } = require("../models");
const { Op } = require("sequelize");

exports.createTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.create(req.body);
    res.status(201).json(transaksi);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Create transaksi failed", error: err.message });
  }
};

exports.getAllTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findAll({ include: DetailTransaksi });
    res.json(transaksi);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fetch transaksi failed", error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const [updated] = await Transaksi.update(
      { status },
      { where: { id: req.params.id } }
    );
    if (!updated)
      return res.status(404).json({ message: "Transaksi not found" });
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

exports.getTransaksiByPetaniId = async (req, res) => {
  try {
    const petaniId = req.params.id;

    // Dapatkan semua produk milik petani ini
    const produkPetani = await Produk.findAll({
      where: { user_id: petaniId },
      attributes: ["id"],
    });

    const produkIds = produkPetani.map((p) => p.id);

    // Dapatkan semua detail transaksi yang melibatkan produk petani
    const detailTransaksi = await DetailTransaksi.findAll({
      where: {
        produk_id: {
          [Op.in]: produkIds,
        },
      },
      include: [
        {
          model: Transaksi,
          include: [User],
        },
        {
          model: Produk,
        },
      ],
    });

    res.json(detailTransaksi);
  } catch (err) {
    res.status(500).json({
      message: "Fetch transaksi petani failed",
      error: err.message,
    });
  }
};
