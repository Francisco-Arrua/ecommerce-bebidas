import { Router } from "express";

import {
  getSubcategorias,
  crearSubcategoria,
  editarSubcategoria,
  eliminarSubcategoria
} from "../controllers/subcategorias.controller.js";

const router = Router();

router.get("/", getSubcategorias);

router.post("/", crearSubcategoria);

router.put("/:id", editarSubcategoria);

router.delete("/:id", eliminarSubcategoria);

export default router;