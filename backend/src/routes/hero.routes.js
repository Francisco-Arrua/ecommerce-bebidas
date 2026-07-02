import { Router } from "express";

import {
  getSlides,
  crearSlide,
  actualizarSlide,
  eliminarSlide,
  cambiarActivo
} from "../controllers/hero.controller.js";

const router = Router();

router.get("/", getSlides);

router.post("/", crearSlide);

router.put("/:id", actualizarSlide);

router.delete("/:id", eliminarSlide);

router.patch("/:id/activo", cambiarActivo);

export default router;