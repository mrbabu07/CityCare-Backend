import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import { PaymentStatus } from "@prisma/client";
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";

const store_id = process.env.SSLCOMMERZ_STORE_ID as string;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD as string;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === "true";
const sslCommerzBaseUrl = is_live
  ? "https://securepay.sslcommerz.com"
  : "https://sandbox.sslcommerz.com";

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

  const existingPayment = await prisma.payment.findUnique({
    where: { complaintId },
  });
  if (
    existingPayment &&
    (existingPayment.status === PaymentStatus.PAID ||
      existingPayment.status === PaymentStatus.REFUNDED)
  ) {
    throw new AppError("This complaint has already been paid for", 409);
  }

  if (existingPayment?.status === PaymentStatus.PENDING) {
    if (existingPayment.gatewayUrl) {
      return {
        paymentUrl: existingPayment.gatewayUrl,
        paymentId: existingPayment.id,
      };
    }
    throw new AppError(
      "Payment session is being created or awaiting reconciliation",
      409,
    );
  }

  const gatewayTransactionId = randomUUID();
  const payment = existingPayment
    ? await prisma.payment
        .updateMany({
          where: { id: existingPayment.id, status: PaymentStatus.FAILED },
          data: {
            status: PaymentStatus.PENDING,
            gatewayTransactionId,
            gatewayUrl: null,
            providerRef: null,
          },
        })
        .then((result) => {
          if (result.count !== 1)
            throw new AppError("Payment changed; refresh its status", 409);
          return {
            ...existingPayment,
            status: PaymentStatus.PENDING,
            gatewayTransactionId,
          };
        })
    : await prisma.payment.create({
        data: {
          complaintId,
          userId,
          amount: PRIORITY_FEE_BDT,
          currency: "BDT",
          status: PaymentStatus.PENDING,
          provider: "sslcommerz",
          gatewayTransactionId,
        },
      });

  const data = {
    total_amount: PRIORITY_FEE_BDT,
    currency: "BDT",
    tran_id: gatewayTransactionId,
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

  const response = await fetch(`${sslCommerzBaseUrl}/gwprocess/v4/api.php`, {
    signal: AbortSignal.timeout(15000),
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, String(value)]),
      ),
      store_id,
      store_passwd,
    }),
  });
  const apiResponse = (await response.json()) as {
    GatewayPageURL?: string;
    failedreason?: string;
  };

  if (!response.ok || !apiResponse.GatewayPageURL) {
    await prisma.payment.updateMany({
      where: {
        id: payment.id,
        status: PaymentStatus.PENDING,
        gatewayTransactionId,
      },
      data: { status: PaymentStatus.FAILED },
    });
    throw new AppError(
      apiResponse.failedreason || "Failed to initiate payment session",
      502,
    );
  }

  await prisma.payment.updateMany({
    where: {
      id: payment.id,
      status: PaymentStatus.PENDING,
      gatewayTransactionId,
    },
    data: { gatewayUrl: apiResponse.GatewayPageURL },
  });

  return { paymentUrl: apiResponse.GatewayPageURL, paymentId: payment.id };
};

export const verifySuccessfulPayment = async (
  paymentId: string,
  validationId: string,
) => {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });

  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  if (!validationId) {
    throw new AppError("Missing SSLCommerz validation ID", 400);
  }

  const query = new URLSearchParams({
    val_id: validationId,
    store_id,
    store_passwd,
    v: "1",
    format: "json",
  });
  const response = await fetch(
    `${sslCommerzBaseUrl}/validator/api/validationserverAPI.php?${query}`,
    { signal: AbortSignal.timeout(15000) },
  );
  const validation = (await response.json()) as {
    status?: string;
    tran_id?: string;
    currency?: string;
    amount?: string;
  };
  const validStatuses = ["VALID", "VALIDATED"];
  const amountMatches = Number(validation?.amount) === payment.amount;

  if (
    !response.ok ||
    !validation.status ||
    !validStatuses.includes(validation.status) ||
    validation?.tran_id !== (payment.gatewayTransactionId || payment.id) ||
    validation?.currency !== payment.currency ||
    !amountMatches
  ) {
    throw new AppError("Payment verification failed", 400);
  }

  return prisma.$transaction(async (tx) => {
    const changed = await tx.payment.updateMany({
      where: {
        id: paymentId,
        gatewayTransactionId: payment.gatewayTransactionId,
        status: { in: [PaymentStatus.PENDING, PaymentStatus.FAILED] },
      },
      data: {
        status: PaymentStatus.PAID,
        providerRef: validationId,
      },
    });
    if (changed.count === 1)
      await tx.complaint.update({
        where: { id: payment.complaintId },
        data: { priority: "URGENT" },
      });
    const current = await tx.payment.findUniqueOrThrow({
      where: { id: paymentId },
    });
    if (
      current.gatewayTransactionId !== payment.gatewayTransactionId ||
      current.status !== PaymentStatus.PAID
    ) {
      throw new AppError(
        "Payment attempt changed; callback was not applied",
        409,
      );
    }
    return current;
  });
};

export const verifyCallbackSignature = (
  payload: Record<string, unknown> = {},
) => {
  if (!store_passwd)
    throw new AppError("Payment provider is not configured", 503);
  if (
    typeof payload.verify_key !== "string" ||
    typeof payload.verify_sign !== "string" ||
    !/^[a-f0-9]{32}$/i.test(payload.verify_sign)
  )
    throw new AppError("Invalid payment signature", 400);
  const keys = payload.verify_key.split(",");
  if (
    !["tran_id", "status", "amount", "currency"].every((key) =>
      keys.includes(key),
    )
  ) {
    throw new AppError("Payment signature is missing required fields", 400);
  }
  const signed = new Map<string, string>();
  for (const key of keys) {
    if (typeof payload[key] !== "string")
      throw new AppError("Invalid signed payment field", 400);
    signed.set(key, payload[key] as string);
  }
  signed.set(
    "store_passwd",
    createHash("md5").update(store_passwd).digest("hex"),
  );
  const value = [...signed.keys()]
    .sort()
    .map((key) => `${key}=${signed.get(key)}`)
    .join("&");
  const expected = createHash("md5").update(value).digest();
  if (!timingSafeEqual(expected, Buffer.from(payload.verify_sign, "hex"))) {
    throw new AppError("Invalid payment signature", 400);
  }
};

export const markPaymentFailed = async (
  paymentId: string,
  payload: Record<string, unknown> = {},
) => {
  verifyCallbackSignature(payload);
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) throw new AppError("Payment not found", 404);
  if (
    payload.tran_id !== (payment.gatewayTransactionId || payment.id) ||
    Number(payload.amount) !== payment.amount ||
    payload.currency !== payment.currency ||
    !["FAILED", "CANCELLED", "UNATTEMPTED", "EXPIRED"].includes(
      String(payload.status),
    )
  ) {
    throw new AppError("Payment callback does not match this attempt", 400);
  }

  await prisma.payment.updateMany({
    where: {
      id: paymentId,
      status: PaymentStatus.PENDING,
      gatewayTransactionId: payment.gatewayTransactionId,
    },
    data: { status: PaymentStatus.FAILED },
  });
  return prisma.payment.findUniqueOrThrow({ where: { id: paymentId } });
};

export const processPaymentNotification = async (
  payload: Record<string, unknown>,
) => {
  verifyCallbackSignature(payload);
  const payment = await prisma.payment.findFirst({
    where: {
      OR: [
        { gatewayTransactionId: String(payload.tran_id) },
        { id: String(payload.tran_id), gatewayTransactionId: null },
      ],
    },
  });
  if (!payment) throw new AppError("Payment attempt not found", 404);
  if (["VALID", "VALIDATED"].includes(String(payload.status))) {
    return verifySuccessfulPayment(
      payment.id,
      typeof payload.val_id === "string" ? payload.val_id : "",
    );
  }
  return markPaymentFailed(payment.id, payload);
};

export const getPaymentStatus = async (
  complaintId: string,
  userId: string,
  role: string,
) => {
  const payment = await prisma.payment.findUnique({ where: { complaintId } });

  if (!payment) {
    throw new AppError("No payment found for this complaint", 404);
  }

  if (role !== "ADMIN" && payment.userId !== userId) {
    throw new AppError("You do not have permission to view this payment", 403);
  }

  return payment;
};
