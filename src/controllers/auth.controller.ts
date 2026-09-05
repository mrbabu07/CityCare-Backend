import { Request, Response } from "express";
import { catchAsync } from "../middlewares/errorHandler";
import { sendSuccess } from "../utils/apiResponse";
import { registerUser, loginUser, refreshAccessToken } from "../services/auth.service";

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  return sendSuccess(res, result, "User registered successfully", 201);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  return sendSuccess(res, result, "User logged in successfully", 200);
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await refreshAccessToken(refreshToken);
  return sendSuccess(res, result, "Access token refreshed successfully");
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  return sendSuccess(res, {}, "Logged out successfully");
});