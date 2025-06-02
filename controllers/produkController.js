const { Produk, User } = require("../models");

exports.createProduk = async (req, res) => {
  try {
    const produk = await Produk.create(req.body);
    res.status(201).json(produk);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Create produk failed", error: err.message });
  }
};

exports.getAllProduk = async (req, res) => {
  try {
    const produk = await Produk.findAll({ include: User });
    res.json(produk);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fetch produk failed", error: err.message });
  }
};

exports.getProdukById = async (req, res) => {
  try {
    const produk = await Produk.findByPk(req.params.id, { include: User });
    if (!produk) return res.status(404).json({ message: "Produk not found" });
    res.json(produk);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

exports.updateProduk = async (req, res) => {
  try {
    const [updated] = await Produk.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ message: "Produk not found" });
    res.json({ message: "Produk updated" });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

exports.deleteProduk = async (req, res) => {
  try {
    const deleted = await Produk.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Produk not found" });
    res.json({ message: "Produk deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
