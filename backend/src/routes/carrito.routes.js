import { Router } from "express";
import { verificarToken } from "../middlewares/auth.middleware.js";

import {
    getCarrito,
    agregarProducto,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito
} from "../controllers/carrito.controller.js";

const router = Router();

router.get("/", verificarToken, getCarrito);

router.post("/", verificarToken, agregarProducto);

// Se agregaron las barras iniciales '/' en item/:id
router.put("/item/:id", verificarToken, actualizarCantidad);

router.delete("/item/:id", verificarToken, eliminarProducto);

router.delete("/vaciar", verificarToken, vaciarCarrito);

export default router;