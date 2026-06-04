import { Router } from "express";
import {
  getProductos,
  crearProducto,
} from "../controllers/productos.controller.js";

const router = Router();

router.get("/", getProductos);
router.post("/", crearProducto);

export default router;