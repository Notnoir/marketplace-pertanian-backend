const rateLimit = require("express-rate-limit");
const ExpressBrute = require("express-brute");
const RedisStore = require("express-brute/lib/MemoryStore"); // Gunakan MemoryStore untuk pengembangan

// Buat store untuk menyimpan data percobaan login
const store = new RedisStore();

// Konfigurasi Brute Force Protection
const bruteforce = new ExpressBrute(store, {
  freeRetries: 5, // Jumlah percobaan login yang diizinkan sebelum delay
  minWait: 60 * 1000, // 1 menit (dalam milidetik)
  maxWait: 60 * 60 * 1000, // 1 jam (dalam milidetik)
  lifetime: 24 * 60 * 60, // 24 jam (dalam detik)
  failCallback: function (req, res, next, nextValidRequestDate) {
    return res.status(429).json({
      message:
        "Terlalu banyak percobaan login yang gagal. Silakan coba lagi setelah " +
        new Date(nextValidRequestDate).toLocaleString("id-ID", {
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        }),
    });
  },
});

// Rate limiter untuk semua request API
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 menit
  max: 300, // Batas 100 request per IP dalam 15 menit
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Terlalu banyak request dari IP ini, silakan coba lagi setelah 1 menit",
  },
});

// Rate limiter khusus untuk endpoint login
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 menit
  max: 5, // Batas 5 request login per IP dalam 15 menit
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Terlalu banyak percobaan login dari IP ini, silakan coba lagi setelah 15 menit",
  },
});

module.exports = {
  apiLimiter,
  loginLimiter,
  bruteforceProtection: bruteforce.prevent, // Ekspor middleware prevent langsung
};
