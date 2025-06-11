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
    // Tambahkan filter berdasarkan user_id jika parameter tersebut ada
    const where = {};
    if (req.query.user_id) {
      where.user_id = req.query.user_id;
    }

    const produk = await Produk.findAll({
      where,
      include: {
        model: User,
        attributes: ["id", "nama", "role"], // Hanya sertakan atribut yang diperlukan
      },
    });
    res.json(produk);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fetch produk failed", error: err.message });
  }
};

exports.getProdukById = async (req, res) => {
  try {
    const produk = await Produk.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: ["id", "nama", "role"], // Hanya sertakan atribut yang diperlukan
      },
    });
    if (!produk) return res.status(404).json({ message: "Produk not found" });
    res.json(produk);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

exports.updateProduk = async (req, res) => {
  try {
    // Tambahkan pengecekan kepemilikan produk
    if (req.query.user_id) {
      const produk = await Produk.findByPk(req.params.id);
      if (produk && produk.user_id != req.query.user_id) {
        return res
          .status(403)
          .json({ message: "Tidak berhak mengubah produk ini" });
      }
    }

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
    // Tambahkan pengecekan kepemilikan produk
    if (req.query.user_id) {
      const produk = await Produk.findByPk(req.params.id);
      if (produk && produk.user_id != req.query.user_id) {
        return res
          .status(403)
          .json({ message: "Tidak berhak menghapus produk ini" });
      }
    }

    const deleted = await Produk.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Produk not found" });
    res.json({ message: "Produk deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
