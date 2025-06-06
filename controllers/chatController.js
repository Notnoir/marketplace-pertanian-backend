const { Chat, User, sequelize } = require("../models");
const { Op } = require("sequelize");

exports.sendMessage = async (req, res) => {
  try {
    const { sender_id, receiver_id, message } = req.body;

    // Validasi input
    if (!sender_id || !receiver_id || !message) {
      return res.status(400).json({ message: "Semua field harus diisi" });
    }

    const chat = await Chat.create({
      sender_id,
      receiver_id,
      message,
    });

    res.status(201).json(chat);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengirim pesan", error: err.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { user_id, other_user_id } = req.params;

    // Validasi input
    if (!user_id || !other_user_id) {
      return res.status(400).json({ message: "ID pengguna diperlukan" });
    }

    // Ambil pesan antara dua pengguna
    const messages = await Chat.findAll({
      where: {
        [Op.or]: [
          { sender_id: user_id, receiver_id: other_user_id },
          { sender_id: other_user_id, receiver_id: user_id },
        ],
      },
      include: [
        { model: User, as: "Sender", attributes: ["id", "nama", "role"] },
        { model: User, as: "Receiver", attributes: ["id", "nama", "role"] },
      ],
      order: [["created_at", "ASC"]],
    });

    res.json(messages);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil percakapan", error: err.message });
  }
};

exports.getUserConversations = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Dapatkan semua pesan yang melibatkan user_id
    const messages = await Chat.findAll({
      where: {
        [Op.or]: [{ sender_id: user_id }, { receiver_id: user_id }],
      },
      include: [
        { model: User, as: "Sender", attributes: ["id", "nama", "role"] },
        { model: User, as: "Receiver", attributes: ["id", "nama", "role"] },
      ],
      order: [["created_at", "DESC"]],
    });

    // Ekstrak ID pengguna yang berinteraksi dengan user_id
    const userIds = new Set();
    messages.forEach((message) => {
      if (message.sender_id === user_id) {
        userIds.add(message.receiver_id);
      } else {
        userIds.add(message.sender_id);
      }
    });

    // Dapatkan informasi pengguna untuk setiap ID
    const users = await User.findAll({
      where: { id: Array.from(userIds) },
      attributes: ["id", "nama", "role"],
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil daftar percakapan",
      error: err.message,
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { message_ids } = req.body;

    await Chat.update({ is_read: true }, { where: { id: message_ids } });

    res.json({ message: "Pesan ditandai sebagai telah dibaca" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal menandai pesan", error: err.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const { user_id } = req.params;

    const count = await Chat.count({
      where: {
        receiver_id: user_id,
        is_read: false,
      },
    });

    res.json({ unread_count: count });
  } catch (err) {
    res.status(500).json({
      message: "Gagal menghitung pesan belum dibaca",
      error: err.message,
    });
  }
};
