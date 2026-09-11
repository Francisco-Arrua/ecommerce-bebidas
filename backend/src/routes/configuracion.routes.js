import { Router } from "express";

import {
  getConfiguracion,
  actualizarConfiguracion,
} from "../controllers/configuracion.controller.js";

import { verificarToken } from "../middlewares/auth.middleware.js";
import { soloAdmin } from "../middlewares/roles.middleware.js";

const router = Router();

// Pública: la usan Carrito.jsx, Navbar, etc. para mostrar whatsapp/redes/etc.
router.get("/", getConfiguracion);

// Protegida: solo un admin logueado puede modificar la configuración de la tienda.
router.put("/", [verificarToken, soloAdmin], actualizarConfiguracion);

export default router;