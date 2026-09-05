import { Router } from "express";
import { register, login, refresh, logout } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import { registerSchema, loginSchema } from "../validations/auth.validation";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", protect, logout);

export default router;