import { Router } from "express";
import { getCredencialesMP, actualizarCredencialesMP } from "../controllers/configuracionpago.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { soloAdmin } from "../middlewares/roles.middleware.js";

const router = Router();

router.get("/", [verificarToken, soloAdmin], getCredencialesMP);
router.put("/", [verificarToken, soloAdmin], actualizarCredencialesMP);

export default router;

