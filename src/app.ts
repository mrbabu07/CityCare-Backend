import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { notFoundHandler, globalErrorHandler } from "./middlewares/errorHandler";

const app: Application = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Server is healthy", data: {} });
});

// এখানে পরে API রুটগুলো mount করব, যেমন:
// app.use("/api/v1/auth", authRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;