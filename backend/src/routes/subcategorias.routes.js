import { Router } from "express";

import {
  getSubcategorias,
  crearSubcategoria,
  editarSubcategoria,
  eliminarSubcategoria
} from "../controllers/subcategorias.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { soloAdmin } from "../middlewares/roles.middleware.js";

const router = Router();

router.get("/", getSubcategorias);

router.post("/", [verificarToken, soloAdmin], crearSubcategoria);

router.put("/:id", [verificarToken, soloAdmin], editarSubcategoria);

router.delete("/:id", [verificarToken, soloAdmin], eliminarSubcategoria);

export default router;