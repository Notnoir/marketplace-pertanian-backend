const express = require("express");
const router = express.Router();
const detailController = require("../controllers/detailTransaksiController");

router.post("/", detailController.addDetail);
router.get("/:id", detailController.getDetailByTransaksiId); // by transaksi_id

module.exports = router;
