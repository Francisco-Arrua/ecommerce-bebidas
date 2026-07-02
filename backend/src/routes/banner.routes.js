import { Router } from "express";

import {
  getBanners,
  crearBanner,
  actualizarBanner,
  eliminarBanner,
  cambiarActivo,
} from "../controllers/banner.controller.js";

const router = Router();

router.get("/", getBanners);

router.post("/", crearBanner);

router.put("/:id", actualizarBanner);

router.delete("/:id", eliminarBanner);

router.patch("/:id/activo", cambiarActivo);

export default router;