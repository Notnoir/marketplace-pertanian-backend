const express = require("express");
const router = express.Router();
const detailController = require("../controllers/detailTransaksiController");
const { verifyToken, isAdmin } = require("../middleware/authJwt");

router.post("/", verifyToken, detailController.addDetail);
router.get("/:id", verifyToken, detailController.getDetailByTransaksiId); // by transaksi_id

module.exports = router;
