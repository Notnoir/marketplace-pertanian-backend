const { User } = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

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
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    res.json({ message: "Login success", user });
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
