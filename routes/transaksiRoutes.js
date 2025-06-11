const express = require("express");
const router = express.Router();
const transaksiController = require("../controllers/transaksiController");
const {
  verifyToken,
  isAdmin,
  isPetani,
  isPembeli,
  isAdminOrPetani,
  isAdminOrPetaniOrPembeli,
} = require("../middleware/authJwt");

// Rute yang memerlukan autentikasi
router.post("/", verifyToken, isPembeli, transaksiController.createTransaksi);
router.get(
  "/",
  verifyToken,
  isAdminOrPetaniOrPembeli,
  transaksiController.getAllTransaksi
);
router.post("/checkout", verifyToken, isPembeli, transaksiController.checkout);
router.patch(
  "/:id/status",
  verifyToken,
  isAdminOrPetani,
  transaksiController.updateStatus
);
// router.put("/:id/status", verifyToken, isAdmin, transaksiController.updateStatus);
router.get(
  "/petani/:id",
  verifyToken,
  transaksiController.getTransaksiByPetaniId
);
// Tambahkan endpoint baru
router.put(
  "/update-status/:id",
  verifyToken,
  isAdminOrPetani,
  transaksiController.updateStatus
);

// Langsung gunakan controller method tanpa pengecekan
router.get("/:id", verifyToken, (req, res) => {
  return transaksiController.getTransaksiById(req, res);
});

module.exports = router;
