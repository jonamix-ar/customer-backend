const router = require("express").Router();
const authController = require("../controllers/authController");
const consultationController = require("../controllers/consultationController");
const verifyToken = require("../middlewares/validate-token");

// Rutas de pruebas
router.get("/", (req, res) => {
  // Accede a la variable de entorno VERSION
  const version = process.env.VERSION;

  // Verifica si la variable de entorno VERSION está definida
  if (version) {
    // Envía la versión como JSON
    res.json({ version });
  } else {
    // Si la variable de entorno no está definida, envía un mensaje de error
    res
      .status(500)
      .json({ error: "La variable de entorno VERSION no está definida." });
  }
});

// Rutas de autenticación
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post(
  "/calculadora-de-indemnizacion",
  consultationController.calculateCompensation
);

// Backend
router.get("/user", verifyToken, authController.getUserData);
router.post("/logout", verifyToken, authController.logout);

module.exports = router;
