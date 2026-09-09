import { Request, Response } from "express";
import { catchAsync } from "../middlewares/errorHandler";
import { sendSuccess } from "../utils/apiResponse";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  softDeleteCategory,
} from "../services/category.service";

export const create = catchAsync(async (req: Request, res: Response) => {
  const category = await createCategory(req.body);
  return sendSuccess(res, category, "Category created successfully", 201);
});

export const getAll = catchAsync(async (req: Request, res: Response) => {
  const departmentId = req.query.departmentId as string | undefined;
  const categories = await getAllCategories(departmentId);
  return sendSuccess(res, categories, "Categories fetched successfully");
});

export const getOne = catchAsync(async (req: Request, res: Response) => {
  const category = await getCategoryById(req.params.id);
  return sendSuccess(res, category, "Category fetched successfully");
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const category = await updateCategory(req.params.id, req.body);
  return sendSuccess(res, category, "Category updated successfully");
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  await softDeleteCategory(req.params.id);
  return sendSuccess(res, {}, "Category deleted successfully");
});