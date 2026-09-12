import { Router } from "express";
import { register, login, refresh, logout } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import { registerSchema, loginSchema } from "../validations/auth.validation";
import { authLimiter } from "../middlewares/rateLimiter";
import { register, login, refresh, logout, googleAuth } from "../controllers/auth.controller";



const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", protect, logout);
router.post("/register", authLimiter, validateRequest(registerSchema), register);
router.post("/login", authLimiter, validateRequest(loginSchema), login);
router.post("/google", authLimiter, googleAuth);



export default router;