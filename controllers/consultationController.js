const bcrypt = require("bcrypt");
const Joi = require("joi");
const UserModel = require("../models/userModel");

const schemaRegister = Joi.object({
  first_name: Joi.string().min(3).max(255).required(),
  last_name: Joi.string().min(3).max(255).required(),
  email: Joi.string().min(3).max(255).required().email(),
  salario: Joi.number().integer().required(),
  incapacidad: Joi.number().integer().required(),
  porcentaje: Joi.number().required(),
  birthday: Joi.date().iso().required(),
  accidenteDate: Joi.date().iso().required(),
});

exports.calculateCompensation = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    salario,
    incapacidad,
    porcentaje,
    birthday,
    accidenteDate,
  } = req.body;

  const { error } = schemaRegister.validate(req.body);
  let total = 0; // Cambiado a let

  // Obtener el año de nacimiento
  const birthYear = new Date(birthday).getFullYear();
  const accidenteYear = new Date(accidenteDate).getFullYear();

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

    console.log("Datos recibidos en el backend:");
    console.log("Nombre:", first_name);
    console.log("Apellido:", last_name);
    console.log("Correo electrónico:", email);
    console.log("Salario:", salario);
    console.log("Incapacidad:", incapacidad);
    console.log("Porcentaje de incapacidad:", porcentaje);
    console.log("Fecha de nacimiento:", birthday);
    console.log("Fecha del accidente:", accidenteDate);
    console.log("Año de nacimiento:", birthYear);

    const edadAlAccidnete = accidenteYear - birthYear;

    console.log("Edad al accidente: ", edadAlAccidnete);

    const formula = (65 / edadAlAccidnete) * (salario * 1.4) * 53 * (porcentaje / 100);
    const percentArt = (formula * 20) / 100;

    if (incapacidad === 2) {
      total = formula + percentArt;
    } else {
      total = formula;
    }

    const formattedTotal = total.toLocaleString("es-ES", {
      style: "currency",
      currency: "ARS", // Cambia esto según la moneda que desees
      minimumFractionDigits: 2,
    });

    //   // Hash de la contraseña
    //   const hashedPassword = await bcrypt.hash(password, 10);

    //   // Crear el nuevo usuario
    //   const newUser = { first_name, last_name, email, password: hashedPassword };
    //   await userModel.createUser(newUser);

    //   // Obtener el ID del usuario recién creado
    //   const createdUser = await UserModel.getUserByEmail(email);
    //   const userId = createdUser.id;

    //   // Crear el perfil de usuario asociado
    //   await profileModel.createProfile(userId);

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      data: {
        "Edad al accidente: ": edadAlAccidnete,
        "Formula Final": formattedTotal,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
