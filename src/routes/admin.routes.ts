import { Router } from "express";
import { dashboardStats, auditLogs } from "../controllers/admin.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();

router.get("/dashboard-stats", protect, authorize("ADMIN"), dashboardStats);
router.get("/audit-logs", protect, authorize("ADMIN"), auditLogs);

export default router;