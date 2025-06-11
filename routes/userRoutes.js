const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  loginLimiter,
  bruteforceProtection,
} = require("../middleware/rateLimiter");
const loginTracker = require("../middleware/loginTracker");
const {
  verifyToken,
  isAdmin,
  isAdminOrPetaniOrPembeli,
} = require("../middleware/authJwt"); // Import middleware JWT

// Rute publik yang tidak memerlukan autentikasi
router.post("/register", userController.register);

// Terapkan rate limiting dan brute force protection pada endpoint login
router.post(
  "/login",
  loginLimiter, // Rate limit berdasarkan IP
  bruteforceProtection, // Brute force protection
  loginTracker.checkLocked, // Periksa apakah akun terkunci
  userController.login
);

// Middleware untuk melindungi semua rute di bawah ini
router.use(verifyToken);

// Endpoint baru untuk admin - dilindungi dengan JWT dan role admin
router.get("/", isAdminOrPetaniOrPembeli, userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", isAdmin, userController.deleteUser);

module.exports = router;
