// Hapus komentar ini
// Ubah baris pertama dari
// const { Chat, User, sequelize } = require("../models");
// Menjadi
const {
  Chat,
  User,
  Produk,
  DetailTransaksi,
  Transaksi,
  sequelize,
} = require("../models");
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

    // Dapatkan informasi user yang sedang login
    const currentUser = await User.findByPk(user_id);
    if (!currentUser) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    // Pendekatan yang lebih sederhana dan reliable untuk mendapatkan chat participants
    // Dapatkan semua chat di mana user adalah sender atau receiver
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [{ sender_id: user_id }, { receiver_id: user_id }],
      },
      raw: true,
    });

    // Ekstrak ID pengguna yang pernah berinteraksi dengan user ini
    const participantIds = new Set();
    chats.forEach((chat) => {
      if (chat.sender_id === user_id) {
        participantIds.add(chat.receiver_id);
      } else {
        participantIds.add(chat.sender_id);
      }
    });

    // Konversi Set ke Array
    const uniqueParticipantIds = [...participantIds];

    // Jika tidak ada percakapan, gunakan logika yang sudah ada
    if (uniqueParticipantIds.length === 0) {
      let allowedUserIds = [];

      // Admin dapat chat dengan semua pengguna
      if (currentUser.role === "ADMIN") {
        // Dapatkan semua pengguna kecuali admin sendiri
        const allUsers = await User.findAll({
          where: {
            id: { [Op.ne]: user_id },
          },
          attributes: ["id", "nama", "role"],
        });

        return res.json(allUsers);
      }

      // Untuk PETANI: dapat chat dengan admin dan pembeli yang pernah membeli produknya
      else if (currentUser.role === "PETANI") {
        // Tambahkan admin ke daftar yang diizinkan
        const admins = await User.findAll({
          where: { role: "ADMIN" },
          attributes: ["id", "nama", "role"],
        });

        admins.forEach((admin) => allowedUserIds.push(admin.id));

        // Dapatkan pembeli yang pernah membeli produk petani ini
        const produkPetani = await Produk.findAll({
          where: { user_id: user_id },
        });

        const produkIds = produkPetani.map((produk) => produk.id);

        if (produkIds.length > 0) {
          // Dapatkan detail transaksi yang berisi produk petani
          const detailTransaksi = await DetailTransaksi.findAll({
            where: {
              produk_id: { [Op.in]: produkIds },
            },
            include: [
              {
                model: Transaksi,
                include: [
                  {
                    model: User,
                    attributes: ["id", "nama", "role"],
                  },
                ],
              },
            ],
          });

          // Ekstrak ID pembeli yang pernah membeli produk petani
          detailTransaksi.forEach((detail) => {
            if (detail.Transaksi && detail.Transaksi.User) {
              allowedUserIds.push(detail.Transaksi.User.id);
            }
          });
        }
      }

      // Untuk PEMBELI: dapat chat dengan admin dan petani yang produknya pernah dibeli
      else if (currentUser.role === "PEMBELI") {
        // Tambahkan admin ke daftar yang diizinkan
        const admins = await User.findAll({
          where: { role: "ADMIN" },
          attributes: ["id", "nama", "role"],
        });

        admins.forEach((admin) => allowedUserIds.push(admin.id));

        // Dapatkan transaksi pembeli
        const transaksiPembeli = await Transaksi.findAll({
          where: { user_id: user_id },
        });

        const transaksiIds = transaksiPembeli.map((transaksi) => transaksi.id);

        if (transaksiIds.length > 0) {
          // Dapatkan detail transaksi untuk transaksi pembeli
          const detailTransaksi = await DetailTransaksi.findAll({
            where: {
              transaksi_id: { [Op.in]: transaksiIds },
            },
            include: [
              {
                model: Produk,
                include: [
                  {
                    model: User,
                    attributes: ["id", "nama", "role"],
                  },
                ],
              },
            ],
          });

          // Ekstrak ID petani yang produknya pernah dibeli pembeli
          detailTransaksi.forEach((detail) => {
            if (detail.Produk && detail.Produk.User) {
              allowedUserIds.push(detail.Produk.User.id);
            }
          });
        }
      }

      // Hapus duplikat ID
      allowedUserIds = [...new Set(allowedUserIds)];

      // Dapatkan informasi pengguna yang diizinkan
      const allowedUsers = await User.findAll({
        where: { id: allowedUserIds },
        attributes: ["id", "nama", "role"],
      });

      return res.json(allowedUsers);
    } else {
      // Dapatkan informasi pengguna yang pernah berinteraksi
      const conversationUsers = await User.findAll({
        where: { id: uniqueParticipantIds },
        attributes: ["id", "nama", "role"],
      });

      return res.json(conversationUsers);
    }
  } catch (err) {
    console.error("Error in getUserConversations:", err);
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
