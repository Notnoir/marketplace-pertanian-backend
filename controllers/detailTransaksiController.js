const { DetailTransaksi, Produk } = require("../models");

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
    // Gunakan Sequelize ORM daripada raw query
    const results = await DetailTransaksi.findAll({
      where: { transaksi_id: transaksiId },
      include: [Produk], // Opsional: Jika ingin menyertakan data produk
    });

    res.json(results);
  } catch (error) {
    console.error("Gagal mengambil detail transaksi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
