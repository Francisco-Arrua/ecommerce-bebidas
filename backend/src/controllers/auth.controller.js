import { prisma } from "../db/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios",
      });
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return res.status(409).json({
        mensaje: "El email ya está registrado",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: passwordHash,
      },
    });

    // 🔥 NUEVO: Generamos el token automáticamente al registrarse
    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Mandamos el token de vuelta al frontend junto al usuario
    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      token, // 🔥 Ahora viaja el token acá
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al registrar usuario",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios",
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        email,
      },
    });

    if (!usuario) {
      return res.status(401).json({
        mensaje: "Credenciales inválidas",
      });
    }

    const passwordCorrecta = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: "Credenciales inválidas",
      });
    }

    const token = jwt.sign(
    {
        id: usuario.id,
        rol: usuario.rol,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
    );

    res.json({
      mensaje: "Login correcto",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al iniciar sesión",
    });
  }
};