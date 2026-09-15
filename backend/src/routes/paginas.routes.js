import { Router } from "express";

import {
  getPaginas,
  getPaginaPorSlug,
  crearPagina,
  editarPagina,
  eliminarPagina,
} from "../controllers/paginas.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { soloAdmin } from "../middlewares/roles.middleware.js";

const router = Router();

router.get(
  "/",
  getPaginas
);

router.get(
  "/:slug",
  getPaginaPorSlug
);

router.post(
  "/",
  [verificarToken, soloAdmin],
  crearPagina
);

router.put(
  "/:id",
  [verificarToken, soloAdmin],
  editarPagina
);

router.delete(
  "/:id",
  [verificarToken, soloAdmin],
  eliminarPagina
);

export default router;