import { Request, Response } from "express";
import { catchAsync } from "../middlewares/errorHandler";
import { sendSuccess } from "../utils/apiResponse";
import { getDashboardStats, getAuditLogs } from "../services/admin.service";

export const dashboardStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await getDashboardStats();
  return sendSuccess(res, stats, "Dashboard stats fetched successfully");
});

export const auditLogs = catchAsync(async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const result = await getAuditLogs(page ? Number(page) : 1, limit ? Number(limit) : 20);
  return sendSuccess(res, result, "Audit logs fetched successfully");
});