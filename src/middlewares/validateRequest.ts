import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validateRequest =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  };
