import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
export declare const validateRequest: (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validateRequest.d.ts.map