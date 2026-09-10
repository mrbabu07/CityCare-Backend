import { Request, Response } from "express";
import { catchAsync } from "../middlewares/errorHandler";
import { sendSuccess } from "../utils/apiResponse";
import { prisma } from "../config/prisma";
import { getMyProfile, updateMyProfile } from "../services/user.service";
import { updateUserRole } from "../services/user.service";


export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
        where: {
            deletedAt: null 
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            createdAt: true,
        },
    });

    return sendSuccess(res, users, "Users fetched successfully", 200);
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await getMyProfile(req.user!.userId);
  return sendSuccess(res, user, "Profile fetched successfully");
});

export const updateMe = catchAsync(async (req: Request, res: Response) => {
  const user = await updateMyProfile(req.user!.userId, req.body);
  return sendSuccess(res, user, "Profile updated successfully");
});

export const changeUserRole = catchAsync(async (req: Request, res: Response) => {
  const user = await updateUserRole(req.params.id, req.body.role, req.user!.userId);
  return sendSuccess(res, user, "User role updated successfully");
});