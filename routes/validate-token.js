const jwt = require("jsonwebtoken");

// Middleware para validar el token (rutas protegidas)
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  
  if (!token) return res.status(401).json({ error: "Acceso denegado" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next(); // Continuar con la siguiente función
  } catch (error) {
    res.status(400).json({ error: "Token no es válido" });
  }
};

module.exports = verifyToken;
