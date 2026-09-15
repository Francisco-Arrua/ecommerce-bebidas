import { Router } from "express";

import {
  getSlides,
  crearSlide,
  actualizarSlide,
  eliminarSlide,
  cambiarActivo
} from "../controllers/hero.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { soloAdmin } from "../middlewares/roles.middleware.js";

const router = Router();

router.get("/", getSlides);

router.post("/", [verificarToken, soloAdmin], crearSlide);

router.put("/:id", [verificarToken, soloAdmin], actualizarSlide);

router.delete("/:id", [verificarToken, soloAdmin], eliminarSlide);

router.patch("/:id/activo", [verificarToken, soloAdmin], cambiarActivo);

export default router;