import { Request, Response, NextFunction } from "express";
export declare const notFoundHandler: (req: Request, res: Response) => void;
export declare const globalErrorHandler: (err: unknown, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const catchAsync: (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map