import { Router } from "express";
import {
  register,
  login,
} from "../controllers/auth.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { prisma } from "../db/prisma.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

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

export default router;