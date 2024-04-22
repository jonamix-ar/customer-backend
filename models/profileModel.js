// models/userModel.js
const db = require("../config/database");

// Definir el modelo para el perfil de usuario
const ProfileModel = {};

// Método para crear un nuevo perfil de usuario
ProfileModel.createProfile = (userId) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO user_profile (user_id) VALUES (?)";
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error("Error al crear un nuevo perfil de usuario:", err);
        reject(err);
      } else {
        console.log("Nuevo perfil de usuario creado:", result.insertId);
        resolve(result.insertId);
      }
    });
  });
};

ProfileModel.updateProfile = (userId, birthday) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO user_profile (user_id, birthday) VALUES (?, ?)";
    db.query(query, [userId, birthday], (err, result) => {
      if (err) {
        console.error("Error al actualizar el perfil de usuario:", err);
        reject(err);
      } else {
        console.log(
          "Perfil de usuario actualizado correctamente:",
          result.insertId
        );
        resolve(result.insertId);
      }
    });
  });
};
module.exports = ProfileModel;
