const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// Mengirim pesan
router.post("/", chatController.sendMessage);

// Mendapatkan percakapan antara dua pengguna
router.get(
  "/conversation/:user_id/:other_user_id",
  chatController.getConversation
);

// Mendapatkan daftar pengguna yang pernah berinteraksi dengan user_id
router.get("/users/:user_id", chatController.getUserConversations);

// Menandai pesan sebagai telah dibaca
router.put("/read", chatController.markAsRead);

// Mendapatkan jumlah pesan yang belum dibaca
router.get("/unread/:user_id", chatController.getUnreadCount);

module.exports = router;
