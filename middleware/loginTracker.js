// Menyimpan percobaan login yang gagal berdasarkan email
const failedLoginAttempts = {};
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 menit dalam milidetik

const loginTracker = {
  // Middleware untuk memeriksa apakah akun terkunci
  checkLocked: (req, res, next) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email diperlukan" });
    }

    const userAttempts = failedLoginAttempts[email];

    if (
      userAttempts &&
      userAttempts.locked &&
      userAttempts.lockUntil > Date.now()
    ) {
      // Akun masih terkunci
      const remainingTime = Math.ceil(
        (userAttempts.lockUntil - Date.now()) / 60000
      ); // dalam menit
      return res.status(429).json({
        message: `Akun terkunci karena terlalu banyak percobaan gagal. Coba lagi dalam ${remainingTime} menit.`,
      });
    } else if (userAttempts && userAttempts.locked) {
      // Jika waktu kunci sudah berakhir, reset status kunci
      failedLoginAttempts[email].locked = false;
      failedLoginAttempts[email].attempts = 0;
    }

    next();
  },

  // Middleware untuk mencatat login yang berhasil
  recordSuccess: (email) => {
    if (failedLoginAttempts[email]) {
      // Reset percobaan gagal jika login berhasil
      delete failedLoginAttempts[email];
    }
  },

  // Middleware untuk mencatat login yang gagal
  recordFailure: (email) => {
    if (!failedLoginAttempts[email]) {
      failedLoginAttempts[email] = {
        attempts: 1,
        locked: false,
        lockUntil: null,
      };
    } else {
      failedLoginAttempts[email].attempts += 1;

      // Jika melebihi batas percobaan, kunci akun
      if (failedLoginAttempts[email].attempts >= MAX_FAILED_ATTEMPTS) {
        failedLoginAttempts[email].locked = true;
        failedLoginAttempts[email].lockUntil = Date.now() + LOCKOUT_TIME;
      }
    }

    return failedLoginAttempts[email];
  },
};

module.exports = loginTracker;
