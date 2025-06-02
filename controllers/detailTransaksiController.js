const { DetailTransaksi } = require("../models");

exports.addDetail = async (req, res) => {
  try {
    const detail = await DetailTransaksi.create(req.body);
    res.status(201).json(detail);
  } catch (err) {
    res.status(500).json({ message: "Add detail failed", error: err.message });
  }
};

exports.getByTransaksiId = async (req, res) => {
  try {
    const details = await DetailTransaksi.findAll({
      where: { transaksi_id: req.params.id },
    });
    res.json(details);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};
