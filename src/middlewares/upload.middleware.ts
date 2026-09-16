import multer from "multer";
import { AppError } from "../utils/AppError";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

export const uploadComplaintAttachment = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(new AppError("Only JPEG, PNG, WebP, and PDF files are allowed", 400));
    }
    callback(null, true);
  },
}).single("file");
