import { Router } from "express";

import {
  getBanners,
  crearBanner,
  actualizarBanner,
  eliminarBanner,
  cambiarActivo,
} from "../controllers/banner.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { soloAdmin } from "../middlewares/roles.middleware.js";

const router = Router();

router.get("/", getBanners);

router.post("/", [verificarToken, soloAdmin], crearBanner);

router.put("/:id", [verificarToken, soloAdmin], actualizarBanner);

router.delete("/:id", [verificarToken, soloAdmin], eliminarBanner);

router.patch("/:id/activo", [verificarToken, soloAdmin], cambiarActivo);

export default router;