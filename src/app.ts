import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes";
import { notFoundHandler, globalErrorHandler } from "./middlewares/errorHandler";
import userRoutes from "./routes/user.routes";
import departmentRoutes from "./routes/department.routes";
import categoryRoutes from "./routes/category.routes";
import complaintRoutes from "./routes/complaint.routes";
import adminRoutes from "./routes/admin.routes";
import paymentRoutes from "./routes/payment.routes";



const app: Application = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the CityCare API",
    data: {
      health: "/health",
      apiBase: "/api/v1",
      documentation: "https://github.com/mrbabu07/CityCare-Backend/blob/main/docs/openapi.yaml",
    },
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Server is healthy", data: {} });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/departments", departmentRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/complaints", complaintRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/payments", paymentRoutes);



app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
