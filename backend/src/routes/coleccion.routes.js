import { Router } from "express";
import { 
  obtenerColeccionesPublicas, 
  obtenerDetalleColeccion,
  crearColeccion,
  actualizarColeccion,
  eliminarColeccion
} from "../controllers/coleccion.controller.js";

// IMPORTACIÓN CORREGIDA: Nombres exactos de tus archivos y funciones
import { verificarToken } from "../middlewares/auth.middleware.js";
import { soloAdmin } from "../middlewares/roles.middleware.js";

const router = Router();

// Rutas Públicas (Clientes)
router.get("/", obtenerColeccionesPublicas);
router.get("/:id", obtenerDetalleColeccion);

// Rutas Privadas (Admin)
// Usamos 'soloAdmin' que es el nombre real de tu función exportada
router.post("/", verificarToken, soloAdmin, crearColeccion);
router.put("/:id", verificarToken, soloAdmin, actualizarColeccion);
router.delete("/:id", verificarToken, soloAdmin, eliminarColeccion);

export default router;