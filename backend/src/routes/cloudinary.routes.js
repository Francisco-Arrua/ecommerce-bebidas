import { Router } from "express";
import {
  testCloudinary,
} from "../controllers/cloudinary.controller.js";

const router = Router();

router.get("/test", testCloudinary);

export default router;