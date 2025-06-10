const express = require("express");
const router = express.Router();
const transaksiController = require("../controllers/transaksiController");

router.post("/", transaksiController.createTransaksi);
router.get("/", transaksiController.getAllTransaksi);
router.post("/checkout", transaksiController.checkout);
router.patch("/:id/status", transaksiController.updateStatus);
// router.put("/:id/status", transaksiController.updateStatus);
router.get("/petani/:id", transaksiController.getTransaksiByPetaniId);
// Tambahkan endpoint baru
router.put("/update-status/:id", transaksiController.updateStatus);

// Langsung gunakan controller method tanpa pengecekan
router.get("/:id", (req, res) => {
  return transaksiController.getTransaksiById(req, res);
});

module.exports = router;
