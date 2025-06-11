const express = require("express");
const router = express.Router();
const produkController = require("../controllers/produkController");
const {
  verifyToken,
  isAdmin,
  isPetani,
  isAdminOrPetani,
} = require("../middleware/authJwt");

// Rute publik (tidak memerlukan autentikasi)
router.get("/", produkController.getAllProduk);
router.get("/:id", produkController.getProdukById);

// Rute yang memerlukan autentikasi
router.post("/", verifyToken, produkController.createProduk);
router.put("/:id", verifyToken, produkController.updateProduk);
router.delete(
  "/:id",
  verifyToken,

  produkController.deleteProduk
);

module.exports = router;
