import { Request, Response } from "express";
import { catchAsync } from "../middlewares/errorHandler";
import { sendSuccess } from "../utils/apiResponse";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  softDeleteDepartment,
} from "../services/department.service";

export const create = catchAsync(async (req: Request, res: Response)=>{
    const department = await createDepartment(req.body);
    return sendSuccess(res, department, "Department created successfully", 201);

});

export const getAll = catchAsync(async (req: Request, res: Response) => {
    const departments = await getAllDepartments();
    return sendSuccess(res, departments, "Departments fetched successfully");
});

export const getOne = catchAsync(async (req: Request, res: Response) =>{
    const department = await getDepartmentById(req.params.id);
    return sendSuccess(res, department, "Department fetched successfully");
});

export const update = catchAsync(async (req: Request, res: Response) => {
    const department = await updateDepartment(req.params.id, req.body);
    return sendSuccess(res, department, "Department updated successfully");
});

export const remove = catchAsync(async (req: Request, res: Response)=> {
    await softDeleteDepartment(req.params.id);
    return sendSuccess(res,  {}, "Department deleted successfully");
})