const mysql = require("mysql");
require('dotenv').config(); // Para cargar variables de entorno desde un archivo .env

const db = mysql.createPool({
  connectionLimit: 10, // Número máximo de conexiones en el pool
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "legalistas",
});

// Manejo de errores de conexión
db.on('error', (err) => {
  console.error('Error al conectar a la base de datos:', err.message);
  process.exit(1); // Salir del proceso con código de error
});

module.exports = db;