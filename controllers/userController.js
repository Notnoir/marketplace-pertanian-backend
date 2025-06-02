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
