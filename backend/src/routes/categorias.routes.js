import { Router } from "express";

import {
  getCategorias,
  crearCategoria,
  editarCategoria,
  eliminarCategoria,
} from "../controllers/categorias.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { soloAdmin } from "../middlewares/roles.middleware.js";

const router = Router();

router.get("/", getCategorias);

router.post("/", [verificarToken, soloAdmin], crearCategoria);

router.put("/:id", [verificarToken, soloAdmin], editarCategoria);

router.delete("/:id", [verificarToken, soloAdmin], eliminarCategoria);

export default router;