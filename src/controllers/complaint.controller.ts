import { Request, Response } from "express";
import { catchAsync } from "../middlewares/errorHandler";
import { sendSuccess } from "../utils/apiResponse";
import {
  createComplaint,
  getComplaintById,
  getComplaints,
  updateComplaintStatus,
  assignStaffToComplaint,
  softDeleteComplaint,
} from "../services/complaint.service";
import { ComplaintStatus } from "@prisma/client";

export const create = catchAsync(async (req: Request, res: Response) => {
  const complaint = await createComplaint(req.user!.userId, req.body);
  return sendSuccess(res, complaint, "Complaint submitted successfully", 201);
});

export const getAll = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, status, departmentId, search } = req.query;

  
  const filters: any = {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    status: status as ComplaintStatus | undefined,
    departmentId: departmentId as string | undefined,
    search: search as string | undefined,
  };

  if (req.user!.role === "CITIZEN") {
    filters.citizenId = req.user!.userId;
  } else if (req.user!.role === "STAFF") {
    filters.assignedToId = req.user!.userId;
  }

  const result = await getComplaints(filters);
  return sendSuccess(res, result, "Complaints fetched successfully");
});

export const getOne = catchAsync(async (req: Request, res: Response) => {
  const complaint = await getComplaintById(req.params.id);
  return sendSuccess(res, complaint, "Complaint fetched successfully");
});

export const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const { status, note } = req.body;
  const complaint = await updateComplaintStatus(req.params.id, status, req.user!.userId, note);
  return sendSuccess(res, complaint, "Complaint status updated successfully");
});

export const assign = catchAsync(async (req: Request, res: Response) => {
  const { staffId } = req.body;
  const complaint = await assignStaffToComplaint(req.params.id, staffId, req.user!.userId);
  return sendSuccess(res, complaint, "Staff assigned successfully");
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  await softDeleteComplaint(req.params.id);
  return sendSuccess(res, {}, "Complaint deleted successfully");
});