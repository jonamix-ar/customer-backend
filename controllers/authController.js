// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const UserModel = require("../models/userModel");
const profileModel = require("../models/profileModel");

require("dotenv").config();

const schemaLogin = Joi.object({});

const schemaRegister = Joi.object({
  first_name: Joi.string().min(3).max(255).required(),
  last_name: Joi.string().min(3).max(255).required(),
  email: Joi.string().min(3).max(255).required().email(),
  password: Joi.string().min(3).max(1024).required(),
});

// Manejar la solicitud de inicio de sesión
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Obtener el usuario de la base de datos
    const user = await UserModel.loginUser(email);

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Enviar el token y los datos del usuario en la respuesta al cliente
    res
      .status(200)
      .json({ message: "Inicio de sesión exitoso", user: user, token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Manejar la solicitud de registro
exports.register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const { error } = schemaRegister.validate(req.body);

  // validate user
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await UserModel.getUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está en uso" });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = { first_name, last_name, email, password: hashedPassword };
    await UserModel.createUser(newUser);

    // Obtener el ID del usuario recién creado
    const createdUser = await UserModel.getUserByEmail(email);
    const userId = createdUser.id;

    // Crear el perfil de usuario asociado
    await profileModel.createProfile(userId);

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.getUserData = (req, res) => {
  // Extrae el ID del usuario del token de autenticación
  const userId = req.user.id;

  // Llama a la función del modelo para obtener los datos del usuario
  UserModel
    .getUserById(userId)
    .then((user) => {
      // Envía los datos del usuario en la respuesta
      res.json(user);
    })
    .catch((error) => {
      // Maneja cualquier error
      res.status(500).json({ error: "Error al obtener los datos del usuario" });
    });
};

// Manejamos el loguot
exports.logout = async (req, res) => {
  res.clearCookie("token"); // Si estás utilizando cookies para almacenar el token
  res.json({ message: "Logout exitoso" });
};
