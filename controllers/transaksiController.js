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
    console.log("Update status request:", req.params.id, req.body);
    const { status } = req.body;
    const [updated] = await Transaksi.update(
      { status },
      { where: { id: req.params.id } }
    );
    console.log("Update result:", updated);
    if (!updated)
      return res.status(404).json({ message: "Transaksi not found" });
    res.json({ message: "Status updated" });
  } catch (err) {
    console.error("Update error:", err);
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

exports.checkout = async (req, res) => {
  try {
    const { transaksi, detail_items } = req.body;

    // Buat transaksi baru
    const newTransaksi = await Transaksi.create(transaksi);

    // Buat detail transaksi untuk setiap item
    const detailPromises = detail_items.map((item) => {
      return DetailTransaksi.create({
        ...item,
        transaksi_id: newTransaksi.id,
      });
    });

    await Promise.all(detailPromises);

    res.status(201).json({
      message: "Checkout berhasil",
      transaksi_id: newTransaksi.id,
    });
  } catch (err) {
    res.status(500).json({
      message: "Checkout failed",
      error: err.message,
    });
  }
};

exports.getTransaksiById = async (req, res) => {
  try {
    console.log(`Fetching transaction with ID: ${req.params.id}`);

    const transaksi = await Transaksi.findByPk(req.params.id, {
      include: [
        {
          model: DetailTransaksi,
          include: [Produk],
        },
        User,
      ],
    });

    if (!transaksi) {
      return res.status(404).json({ message: "Transaksi not found" });
    }

    // Pastikan data valid sebelum dikirim
    const responseData = transaksi.toJSON();
    console.log("Transaction data retrieved successfully");

    res.json(responseData);
  } catch (err) {
    console.error("Error fetching transaction:", err);
    res.status(500).json({
      message: "Fetch transaksi failed",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};
