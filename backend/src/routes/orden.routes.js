import { Router } from "express";
import {
  getMisOrdenes,
  getOrdenPorId,
  getTodasLasOrdenes,
  actualizarEstadoOrden,
} from "../controllers/orden.controller.js";

import { verificarToken } from "../middlewares/auth.middleware.js";
import { soloAdmin } from "../middlewares/roles.middleware.js";

const router = Router();

// Rutas Cliente
router.get("/mis-ordenes", verificarToken, getMisOrdenes);

// Rutas Admin
router.get("/admin/todas", [verificarToken, soloAdmin], getTodasLasOrdenes);
router.patch("/:id/estado", [verificarToken, soloAdmin], actualizarEstadoOrden);

// Detalle de una orden específica. Debe quedar después de las rutas estáticas.
router.get("/:id", verificarToken, getOrdenPorId);

export default router;