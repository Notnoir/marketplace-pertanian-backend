const express = require("express");
const { sequelize } = require("./models");

const userRoutes = require("./routes/userRoutes");
const produkRoutes = require("./routes/produkRoutes");
const transaksiRoutes = require("./routes/transaksiRoutes");
const detailRoutes = require("./routes/detailTransaksiRoutes");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
// Remove this line: app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/produk", produkRoutes);
app.use("/api/transaksi", transaksiRoutes);
app.use("/api/detail", detailRoutes);

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
