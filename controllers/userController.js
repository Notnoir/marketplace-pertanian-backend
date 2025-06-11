const { User } = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const loginTracker = require("../middleware/loginTracker");
const { generateToken } = require("../middleware/authJwt"); // Import fungsi generateToken

exports.register = async (req, res) => {
  try {
    const { nama, email, password, role, alamat, no_hp } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      nama,
      email,
      password: hashedPassword,
      role,
      alamat,
      no_hp,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: "Register failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Catat percobaan login yang gagal
      if (email) {
        const attempts = loginTracker.recordFailure(email);
        const remainingAttempts = 5 - attempts.attempts;

        if (attempts.locked) {
          const lockoutMinutes = Math.ceil(
            (attempts.lockUntil - Date.now()) / 60000
          );
          return res.status(429).json({
            message: `Akun terkunci karena terlalu banyak percobaan gagal. Coba lagi dalam ${lockoutMinutes} menit.`,
          });
        } else {
          return res.status(404).json({
            message: `User tidak ditemukan. Sisa percobaan: ${
              remainingAttempts > 0 ? remainingAttempts : 0
            }`,
          });
        }
      } else {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // Catat percobaan login yang gagal
      const attempts = loginTracker.recordFailure(email);
      const remainingAttempts = 5 - attempts.attempts;

      if (attempts.locked) {
        const lockoutMinutes = Math.ceil(
          (attempts.lockUntil - Date.now()) / 60000
        );
        return res.status(429).json({
          message: `Akun terkunci karena terlalu banyak percobaan gagal. Coba lagi dalam ${lockoutMinutes} menit.`,
        });
      } else {
        return res.status(401).json({
          message: `Password salah. Sisa percobaan: ${
            remainingAttempts > 0 ? remainingAttempts : 0
          }`,
        });
      }
    }

    // Jika login berhasil, reset percobaan gagal
    loginTracker.recordSuccess(email);

    // Generate JWT token
    const token = generateToken(user);

    // Kirim token bersama dengan data user (tanpa password)
    const userData = { ...user.get() };
    delete userData.password;

    res.json({
      message: "Login success",
      user: userData,
      token: token,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// Endpoint baru untuk admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["created_at", "DESC"]],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Fetch users failed", error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Fetch user failed", error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { nama, email, role, alamat, no_hp, password } = req.body;
    const updateData = { nama, email, role, alamat, no_hp };

    // Jika password diubah, hash password baru
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const [updated] = await User.update(updateData, {
      where: { id: req.params.id },
    });

    if (!updated) return res.status(404).json({ message: "User not found" });

    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Update user failed", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete user failed", error: err.message });
  }
};
