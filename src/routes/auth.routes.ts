import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  refreshTokenSchema,
  logoutSchema,
} from "../validations/auth.validation";
import { authLimiter } from "../middlewares/rateLimiter";
import {
  register,
  login,
  refresh,
  logout,
  googleAuth,
} from "../controllers/auth.controller";

const router = Router();

router.post("/refresh", validateRequest(refreshTokenSchema), refresh);
router.post("/logout", protect, validateRequest(logoutSchema), logout);
router.post(
  "/register",
  authLimiter,
  validateRequest(registerSchema),
  register,
);
router.post("/login", authLimiter, validateRequest(loginSchema), login);
router.post(
  "/google",
  authLimiter,
  validateRequest(googleLoginSchema),
  googleAuth,
);

export default router;
