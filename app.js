const express = require("express");
const { sequelize } = require("./models");

const userRoutes = require("./routes/userRoutes");
const produkRoutes = require("./routes/produkRoutes");
const transaksiRoutes = require("./routes/transaksiRoutes");
const detailRoutes = require("./routes/detailTransaksiRoutes");
const chatRoutes = require("./routes/chatRoutes"); // Tambahkan ini
const cors = require("cors");
const { apiLimiter } = require("./middleware/rateLimiter"); // Import rate limiter
const { verifyToken } = require("./middleware/authJwt"); // Import middleware JWT

const app = express();

app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Terapkan rate limiter global untuk semua request API
// Hapus rate limiter global
// app.use(apiLimiter);

// Terapkan rate limiter hanya pada endpoint yang rentan terhadap penyalahgunaan
// Terapkan rate limiter dan JWT middleware pada endpoint users
// Kecuali untuk endpoint login dan register yang perlu diakses tanpa token
// app.use("/api/users/login", apiLimiter, userRoutes);
// app.use("/api/users/register", apiLimiter, userRoutes);
// Terapkan rate limiter pada endpoint users
app.use("/api/users", apiLimiter, userRoutes);
app.use("/api/produk", produkRoutes);
app.use("/api/transaksi", transaksiRoutes);
app.use("/api/detail-transaksi", detailRoutes);
app.use("/api/chat", chatRoutes); // Tambahkan ini

app.get("/", (req, res) => res.send("API Marketplace Produk Pertanian Lokal"));

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced");
    app.listen(5000, () =>
      console.log("Server running at http://localhost:5000")
    );
  })
  .catch((err) => console.error("DB Sync error:", err));
