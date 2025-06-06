const { DetailTransaksi } = require("../models");
const pool = require("../config/database");

exports.addDetail = async (req, res) => {
  try {
    const detail = await DetailTransaksi.create(req.body);
    res.status(201).json(detail);
  } catch (err) {
    res.status(500).json({ message: "Add detail failed", error: err.message });
  }
};

exports.getDetailByTransaksiId = async (req, res) => {
  const transaksiId = req.params.id;

  try {
    const [results] = await pool.query(
      "SELECT * FROM detail_transaksi WHERE transaksi_id = ?",
      [transaksiId]
    );

    res.json(results);
  } catch (error) {
    console.error("Gagal mengambil detail transaksi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
