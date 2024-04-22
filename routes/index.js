const router = require("express").Router();
const authController = require("../controllers/authController");
const consultationController = require("../controllers/consultationController");
const verifyToken = require("../middlewares/validate-token");

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
