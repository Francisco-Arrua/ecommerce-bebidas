import { Router } from "express";

import {
  getCategorias,
  crearCategoria,
  editarCategoria,
  eliminarCategoria,
} from "../controllers/categorias.controller.js";

const router = Router();

router.get("/", getCategorias);

router.post("/", crearCategoria);

router.put("/:id", editarCategoria);

router.delete("/:id", eliminarCategoria);

export default router;