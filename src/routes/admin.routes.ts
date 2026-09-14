import { Router } from "express";
import { dashboardStats, auditLogs } from "../controllers/admin.controller";
import { protect, authorize } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import { paginationSchema } from "../validations/common.validation";

const router = Router();

router.get("/dashboard-stats", protect, authorize("ADMIN"), dashboardStats);
router.get("/audit-logs", protect, authorize("ADMIN"), validateRequest(paginationSchema), auditLogs);

export default router;
