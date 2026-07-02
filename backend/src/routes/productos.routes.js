import { Router } from "express";

import {
  getProductos,
  getProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  actualizarStock,
  cambiarActivo,
  cambiarDestacado,
  getProductosRelacionados,
} from "../controllers/productos.controller.js";

const router = Router();

router.get("/", getProductos);

router.get("/:id", getProducto);

router.post("/", crearProducto);

router.put("/:id", actualizarProducto);

router.patch("/:id/stock", actualizarStock);

router.delete("/:id", eliminarProducto);

router.patch("/:id/activo", cambiarActivo);

router.patch("/:id/destacado", cambiarDestacado);

router.get("/", getProductos);

router.get("/:id/relacionados", getProductosRelacionados);

router.get("/:id", getProducto);

export default router;