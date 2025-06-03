const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  loginLimiter,
  bruteforceProtection,
} = require("../middleware/rateLimiter");
const loginTracker = require("../middleware/loginTracker");

router.post("/register", userController.register);

// Terapkan rate limiting dan brute force protection pada endpoint login
router.post(
  "/login",
  loginLimiter, // Rate limit berdasarkan IP
  bruteforceProtection, // Brute force protection
  loginTracker.checkLocked, // Periksa apakah akun terkunci
  userController.login
);

// Endpoint baru untuk admin
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
