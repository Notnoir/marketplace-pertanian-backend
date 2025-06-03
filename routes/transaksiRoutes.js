const express = require("express");
const router = express.Router();
const transaksiController = require("../controllers/transaksiController");

router.post("/", transaksiController.createTransaksi);
router.get("/", transaksiController.getAllTransaksi);
// router.patch("/:id/status", transaksiController.updateStatus);
router.put("/:id/status", transaksiController.updateStatus);
router.get("/petani/:id", transaksiController.getTransaksiByPetaniId); // Endpoint baru
// Tambahkan endpoint baru
router.put("/update-status/:id", transaksiController.updateStatus);

module.exports = router;
