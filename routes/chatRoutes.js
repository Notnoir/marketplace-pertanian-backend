const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const {
  verifyToken,
  isAdminOrPetaniOrPembeli,
} = require("../middleware/authJwt");

// Semua rute chat memerlukan autentikasi

// Mengirim pesan
router.post(
  "/",
  verifyToken,
  isAdminOrPetaniOrPembeli,
  chatController.sendMessage
);

// Mendapatkan percakapan antara dua pengguna
router.get(
  "/conversation/:user_id/:other_user_id",
  verifyToken,
  isAdminOrPetaniOrPembeli,
  chatController.getConversation
);

// Mendapatkan daftar pengguna yang pernah berinteraksi dengan user_id
router.get(
  "/users/:user_id",
  verifyToken,
  isAdminOrPetaniOrPembeli,
  chatController.getUserConversations
);

// Menandai pesan sebagai telah dibaca
router.put(
  "/read",
  verifyToken,
  isAdminOrPetaniOrPembeli,
  chatController.markAsRead
);

// Mendapatkan jumlah pesan yang belum dibaca
router.get(
  "/unread/:user_id",
  verifyToken,
  isAdminOrPetaniOrPembeli,
  chatController.getUnreadCount
);

module.exports = router;
