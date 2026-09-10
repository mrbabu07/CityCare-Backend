import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import { PaymentStatus } from "@prisma/client";

const SSLCommerzPayment = require("sslcommerz-lts");

const store_id = process.env.SSLCOMMERZ_STORE_ID as string;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD as string;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === "true";

const PRIORITY_FEE_BDT = 100; 

export const initiatePayment = async (complaintId: string, userId: string) => {
  const complaint = await prisma.complaint.findFirst({
    where: { id: complaintId, deletedAt: null },
    include: { citizen: true },
  });

  if (!complaint) {
    throw new AppError("Complaint not found", 404);
  }

  if (complaint.citizenId !== userId) {
    throw new AppError("You can only pay for your own complaint", 403);
  }

  const existingPayment = await prisma.payment.findUnique({ where: { complaintId } });
  if (existingPayment && existingPayment.status === PaymentStatus.PAID) {
    throw new AppError("This complaint has already been paid for", 409);
  }

  
  const payment = await prisma.payment.upsert({
    where: { complaintId },
    update: { status: PaymentStatus.PENDING, amount: PRIORITY_FEE_BDT },
    create: {
      complaintId,
      userId,
      amount: PRIORITY_FEE_BDT,
      currency: "BDT",
      status: PaymentStatus.PENDING,
      provider: "sslcommerz",
    },
  });

  const data = {
    total_amount: PRIORITY_FEE_BDT,
    currency: "BDT",
    tran_id: payment.id, 
    success_url: `${process.env.BACKEND_URL}/api/v1/payments/success/${payment.id}`,
    fail_url: `${process.env.BACKEND_URL}/api/v1/payments/fail/${payment.id}`,
    cancel_url: `${process.env.BACKEND_URL}/api/v1/payments/cancel/${payment.id}`,
    ipn_url: `${process.env.BACKEND_URL}/api/v1/payments/webhook`,
    shipping_method: "NO",
    product_name: "Complaint Priority Service",
    product_category: "Service",
    product_profile: "general",
    cus_name: complaint.citizen.name,
    cus_email: complaint.citizen.email,
    cus_add1: complaint.address,
    cus_city: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: complaint.citizen.phone || "01700000000",
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const apiResponse = await sslcz.init(data);

  if (!apiResponse?.GatewayPageURL) {
    throw new AppError("Failed to initiate payment session", 502);
  }

  return { paymentUrl: apiResponse.GatewayPageURL, paymentId: payment.id };
};

export const verifyAndUpdatePayment = async (
  paymentId: string,
  status: "success" | "fail" | "cancel"
) => {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });

  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  if (status === "success") {
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatus.PAID },
      }),
      prisma.complaint.update({
        where: { id: payment.complaintId },
        data: { priority: "URGENT" },
      }),
    ]);
  } else {
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.FAILED },
    });
  }

  return { status };
};

export const getPaymentStatus = async (complaintId: string) => {
  const payment = await prisma.payment.findUnique({ where: { complaintId } });

  if (!payment) {
    throw new AppError("No payment found for this complaint", 404);
  }

  return payment;
};