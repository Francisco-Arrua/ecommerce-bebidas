import { Router } from "express";
import rateLimit from "express-rate-limit"; 
import { register, login, cerrarSesion, cambiarPassword, solicitarRecuperacion, restablecerPassword } from "../controllers/auth.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { prisma } from "../db/prisma.js";


const router = Router();


const limitadorRegistro = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora en milisegundos
  max: 3, 
  message: {
    mensaje: "Demasiadas cuentas creadas desde esta red. Intentá de nuevo más tarde."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const limitadorLogin = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, 
  message: {
    mensaje: "Demasiados intentos de inicio de sesión. Bloqueado por 15 minutos."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", limitadorRegistro, register);

router.post("/login", limitadorLogin, login);
router.post("/logout", cerrarSesion);

router.put("/cambiar-password", verificarToken, cambiarPassword);

router.get("/me", verificarToken, async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
      },
    });

    res.json({ usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener usuario" });
  }
});

router.post("/solicitar-recuperacion", solicitarRecuperacion);
router.post("/restablecer-password", restablecerPassword);

export default router;