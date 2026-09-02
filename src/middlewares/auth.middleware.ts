import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, JwtPayload } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { prisma } from "../config/prisma";

// req অবজেক্টে আমাদের নিজের "user" ফিল্ড যোগ করার জন্য TypeScript-কে জানানো
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ১. Header থেকে টোকেন বের করা
    const authHeader = req.headers.authorization; // ফরম্যাট: "Bearer <token>"

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("You are not logged in. Please log in to continue.", 401);
    }

    const token = authHeader.split(" ")[1];

    // ২. টোকেন যাচাই করা
    const decoded = verifyAccessToken(token);

    // ৩. ইউজার এখনো ডাটাবেজে আছে এবং active কিনা চেক করা
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user || !user.isActive || user.deletedAt) {
      throw new AppError("This user no longer exists or is inactive.", 401);
    }

    // ৪. পরবর্তী middleware/controller-এর জন্য req.user-এ বসিয়ে দেওয়া
    req.user = { userId: user.id, role: user.role };

    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(new AppError("Invalid or expired token. Please log in again.", 401));
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action.", 403));
    }
    next();
  };
};