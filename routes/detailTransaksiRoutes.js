const express = require("express");
const router = express.Router();
const detailController = require("../controllers/detailTransaksiController");

router.post("/", detailController.addDetail);
router.get("/:id", detailController.getByTransaksiId); // by transaksi_id

module.exports = router;
