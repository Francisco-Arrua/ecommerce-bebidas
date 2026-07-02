import { Router } from "express";

import {
  getPaginas,
  getPaginaPorSlug,
  crearPagina,
  editarPagina,
  eliminarPagina,
} from "../controllers/paginas.controller.js";

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
  crearPagina
);

router.put(
  "/:id",
  editarPagina
);

router.delete(
  "/:id",
  eliminarPagina
);

export default router;