// models/userModel.js
const db = require("../config/database");

const UserModel = {
  // Login user
  loginUser: (email) => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        }
      );
    });
  },

  createUser: (user) => {
    return new Promise((resolve, reject) => {
      db.query("INSERT INTO users SET ?", user, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  getUserById: (userId) => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  },

  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE email = ?", email, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0]); // Suponiendo que solo debería haber un usuario con un correo electrónico dado
        }
      });
    });
  },
};

module.exports = UserModel;
