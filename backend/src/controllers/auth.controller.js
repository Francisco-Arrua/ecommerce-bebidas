import { prisma } from "../db/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

export const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, nuevaPassword } = req.body;
    // req.usuario.id viene del middleware verificarToken
    const usuarioId = req.usuario.id; 

    if (!passwordActual || !nuevaPassword) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios",
      });
    }

    // 1. Buscamos al usuario en la base de datos
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      return res.status(444).json({ mensaje: "Usuario no encontrado" });
    }

    // 2. Verificamos si la contraseña ACTUAL que ingresó es correcta
    const passwordCorrecta = await bcrypt.compare(
      passwordActual,
      usuario.password
    );

    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: "La contraseña actual es incorrecta",
      });
    }

    // 3. Hasheamos la NUEVA contraseña
    const nuevaPasswordHash = await bcrypt.hash(nuevaPassword, 10);

    // 4. Actualizamos en la base de datos usando Prisma
    await prisma.usuario.update({
      where: { id: usuarioId },
      data: { password: nuevaPasswordHash },
    });

    res.json({
      mensaje: "Contraseña modificada correctamente",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al cambiar la contraseña",
    });
  }
};


export const solicitarRecuperacion = async (req, res) => {
  try {
    const { email } = req.body;

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      // Por seguridad, no le digas al atacante si el email existe o no.
      return res.json({ mensaje: "Si el email existe, se envió un correo de recuperación." });
    }

    // Generamos un token aleatorio seguro de 32 caracteres hex
    const token = crypto.randomBytes(16).toString("hex");
    // El token vence en 15 minutos desde ahora
    const expiracion = new Date(Date.now() + 15 * 60 * 1000);

    // Guardamos el token en el usuario usando Prisma
    await prisma.usuario.update({
      where: { email },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expiracion,
      },
    });

    // Enlace que apunta a tu FRONTEND (React) llevando el token en la URL
    const enlaceRecuperacion = `http://localhost:5173/restablecer-password?token=${token}`;

    // Enviamos el mail con el botón HTML
    await resend.emails.send({
      from: "Soporte <onboarding@resend.dev>", // Cambiar por tu dominio real en producción
      to: email,
      subject: "Restablecer tu contraseña",
      html: `
        <div style="font-family: sans-serif; max-width: 450px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <h2 style="color: #0f172a; margin-top: 0;">¿Olvidaste tu contraseña?</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.5;">Recibimos una solicitud para restablecer la contraseña de tu cuenta. Hacé clic en el botón de abajo para continuar. Este enlace expira en 15 minutos.</p>
          <a href="${enlaceRecuperacion}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 16px 0;">
            Restablecer Contraseña
          </a>
          <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">Si no solicitaste este cambio, podés ignorar este correo de forma segura.</p>
        </div>
      `,
    });

    res.json({ mensaje: "Si el email existe, se envió un correo de recuperación." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al procesar la solicitud de recuperación." });
  }
};

// 2. El usuario usa el token del mail para guardar la NUEVA contraseña
export const restablecerPassword = async (req, res) => {
  try {
    const { token, nuevaPassword } = req.body;

    // Buscamos al usuario que tenga ese token Y que la fecha de expiración sea mayor a "ahora"
    const usuario = await prisma.usuario.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() }, // gt = Greater Than (Mayor que ahora)
      },
    });

    if (!usuario) {
      return res.status(400).json({ mensaje: "El token es inválido o ya ha expirado." });
    }

    // Hasheamos la nueva contraseña
    const passwordHash = await bcrypt.hash(nuevaPassword, 10);

    // Actualizamos la contraseña y BORRAMOS los campos del token para que no se puedan volver a usar
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        password: passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    res.json({ mensaje: "Contraseña restablecida con éxito. Ya podés iniciar sesión." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al cambiar la contraseña." });
  }
};