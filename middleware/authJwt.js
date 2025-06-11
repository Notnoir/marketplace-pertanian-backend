const jwt = require("jsonwebtoken");

// Kunci rahasia untuk menandatangani token
// Sebaiknya simpan di environment variable untuk keamanan
const JWT_SECRET = "marketplace-pertanian-jwt-secret-key";

// Middleware untuk membuat token JWT
exports.generateToken = (user) => {
  // Buat payload dengan data user yang diperlukan (jangan sertakan password)
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    nama: user.nama,
  };

  // Buat token dengan masa berlaku 24 jam
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

// Middleware untuk verifikasi token
exports.verifyToken = (req, res, next) => {
  // Ambil token dari header Authorization
  console.log("verifyToken DIJALANKAN");
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Anda tidak memiliki akses 🤪" }); //Token tidak disediakan
  }

  // Verifikasi token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token tidak valid atau kedaluwarsa" });
    }

    // Simpan data user dari token ke request object
    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.userEmail = decoded.email;
    next();
  });
};

// Middleware untuk memeriksa role admin
exports.isAdmin = (req, res, next) => {
  if (req.userRole !== "ADMIN") {
    return res.status(403).json({ message: "Akses anda ditolak error: 274A" }); // Memerlukan role Admin
  }
  next();
};

// Middleware untuk memeriksa role petani
exports.isPetani = (req, res, next) => {
  if (req.userRole !== "PETANI") {
    return res.status(403).json({ message: "Memerlukan role Petani" });
  }
  next();
};

// Middleware untuk memeriksa role pembeli
exports.isPembeli = (req, res, next) => {
  if (req.userRole !== "PEMBELI") {
    return res.status(403).json({ message: "Memerlukan role Pembeli" });
  }
  next();
};

exports.isAdminOrPetani = (req, res, next) => {
  if (req.userRole === "ADMIN" || req.userRole === "PETANI") {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Hanya admin atau petani yang boleh mengakses" });
};

// middleware/roleCheck.js
exports.isAdminOrPetaniOrPembeli = (req, res, next) => {
  if (!["ADMIN", "PETANI", "PEMBELI"].includes(req.userRole)) {
    return res.status(403).json({ message: "Akses ditolak" });
  }
  next();
};

// Middleware untuk memvalidasi pemilik produk
exports.isProdukOwner = async (req, res, next) => {
  try {
    const { Produk } = require("../models");
    const produkId = req.params.id;
    const userId = req.userId;

    const produk = await Produk.findByPk(produkId);

    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    if (produk.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Anda tidak memiliki akses ke produk ini" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Middleware untuk memvalidasi pemilik transaksi
exports.isTransaksiOwner = async (req, res, next) => {
  try {
    const { Transaksi } = require("../models");
    const transaksiId = req.params.id;
    const userId = req.userId;

    const transaksi = await Transaksi.findByPk(transaksiId);

    if (!transaksi) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    if (transaksi.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Anda tidak memiliki akses ke transaksi ini" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
