import { Router } from "express";
import { crearPreferencia, recibirWebhook } from "../controllers/pago.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/crear-preferencia", verificarToken, crearPreferencia);

router.post("/webhook", recibirWebhook);

export default router;
