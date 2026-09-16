import type { UploadApiResponse } from "cloudinary";
import { prisma } from "../config/prisma";
import { cloudinary } from "../config/cloudinary";
import { AppError } from "../utils/AppError";
import { assertComplaintAccess, getComplaintById } from "./complaint.service";

type RequestUser = { userId: string; role: string };

const uploadBuffer = (file: Express.Multer.File) =>
  new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "citycare/complaints",
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Cloudinary upload failed"));
        resolve(result);
      },
    );
    stream.end(file.buffer);
  });

export const createAttachment = async (
  complaintId: string,
  file: Express.Multer.File | undefined,
  user: RequestUser,
) => {
  if (!file) throw new AppError("Attachment file is required", 400);

  const complaint = await getComplaintById(complaintId);
  assertComplaintAccess(complaint, user);

  const uploaded = await uploadBuffer(file);
  try {
    return await prisma.$transaction(async (tx) => {
      const attachment = await tx.attachment.create({
        data: {
          complaintId,
          uploadedById: user.userId,
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
          type: uploaded.resource_type,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: user.userId,
          action: "ATTACHMENT_UPLOADED",
          entityType: "Complaint",
          entityId: complaintId,
          metadata: { attachmentId: attachment.id, mimeType: file.mimetype },
        },
      });

      return attachment;
    });
  } catch (error) {
    await cloudinary.uploader.destroy(uploaded.public_id, {
      resource_type: uploaded.resource_type,
    });
    throw error;
  }
};

export const deleteAttachment = async (
  complaintId: string,
  attachmentId: string,
  user: RequestUser,
) => {
  const complaint = await getComplaintById(complaintId);
  assertComplaintAccess(complaint, user);

  const attachment = await prisma.attachment.findFirst({
    where: { id: attachmentId, complaintId },
  });
  if (!attachment) throw new AppError("Attachment not found", 404);

  if (user.role !== "ADMIN" && attachment.uploadedById !== user.userId) {
    throw new AppError("Only the uploader or an admin can delete this attachment", 403);
  }

  if (attachment.publicId) {
    await cloudinary.uploader.destroy(attachment.publicId, {
      resource_type: attachment.type,
    });
  }

  await prisma.$transaction([
    prisma.attachment.delete({ where: { id: attachment.id } }),
    prisma.auditLog.create({
      data: {
        actorId: user.userId,
        action: "ATTACHMENT_DELETED",
        entityType: "Complaint",
        entityId: complaintId,
        metadata: { attachmentId },
      },
    }),
  ]);
};
