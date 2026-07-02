import { Router } from "express";
import { verificarToken } from "../middlewares/auth.middleware.js"

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

router.put("/:id",verificarToken, actualizarCantidad);

router.delete("/:id", verificarToken, eliminarProducto);

router.delete("/", verificarToken, vaciarCarrito);

export default router;