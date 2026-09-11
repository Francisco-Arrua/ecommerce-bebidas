import { Router } from "express";
import {
  getOpcionesEnvioActivas,
  getTodasLasOpcionesEnvio,
  crearOpcionEnvio,
  actualizarOpcionEnvio,
  eliminarOpcionEnvio,
} from "../controllers/envio.controller.js";

import { verificarToken } from "../middlewares/auth.middleware.js";
import { soloAdmin } from "../middlewares/roles.middleware.js";

const router = Router();

// Ruta pública / cliente
router.get("/", getOpcionesEnvioActivas);

// Rutas de administración
router.get("/admin/todas", [verificarToken, soloAdmin], getTodasLasOpcionesEnvio);
router.post("/", [verificarToken, soloAdmin], crearOpcionEnvio);
router.put("/:id", [verificarToken, soloAdmin], actualizarOpcionEnvio);
router.delete("/:id", [verificarToken, soloAdmin], eliminarOpcionEnvio);

export default router;