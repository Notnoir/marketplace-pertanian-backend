const express = require("express");
const router = express.Router();
const transaksiController = require("../controllers/transaksiController");

router.post("/", transaksiController.createTransaksi);
router.get("/", transaksiController.getAllTransaksi);
router.patch("/:id/status", transaksiController.updateStatus);

module.exports = router;
