import { Router } from "express";
import { obtenerClientes } from "../controllers/clientes.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Más adelante podemos agregar verificarAdmin
router.get("/", verificarToken, obtenerClientes);

export default router;