import { Router } from "express";

import {
  getConfiguracion,
  actualizarConfiguracion,
} from "../controllers/configuracion.controller.js";

const router = Router();

router.get("/", getConfiguracion);

router.put(
  "/",
  actualizarConfiguracion
);

export default router;