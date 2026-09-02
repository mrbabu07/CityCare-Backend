import { Request, Response } from "express";
import { catchAsync } from "../middlewares/errorHandler";
import { sendSuccess } from "../utils/apiResponse";
import { registerUser, loginUser } from "../services/auth.service";

export const register = catchAsync(async (req: Request, res: Response) => {
    const result = await registerUser(req.body);
    return sendSuccess(res, result, "User registered successfully", 201);
})

export const login = catchAsync(async (req: Request, res: Response) => {
    const result = await loginUser(req.body);
    return sendSuccess(res, result, "User logged in successfully", 200);
});