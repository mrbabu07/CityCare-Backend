const { test, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
process.env.SSLCOMMERZ_STORE_PASSWORD = "unit-test-store-password";
const unexpected = async () => {
  throw new Error("Unexpected database operation");
};
const prisma = {
  payment: {
    findUnique: unexpected,
    findFirst: unexpected,
    findUniqueOrThrow: unexpected,
    updateMany: unexpected,
  },
  complaint: { findFirst: unexpected },
  $transaction: unexpected,
};
require("../dist/config/prisma").prisma = prisma;
const paymentService = require("../dist/services/payment.service");
const { mock } = require("node:test");
afterEach(() => mock.restoreAll());

const payment = {
  id: "payment-1",
  complaintId: "complaint-1",
  userId: "citizen-1",
  amount: 100,
  currency: "BDT",
  status: "PENDING",
  gatewayTransactionId: "attempt-1",
};
function notification(overrides = {}) {
  const data = {
    tran_id: "attempt-1",
    status: "FAILED",
    amount: "100.00",
    currency: "BDT",
    ...overrides,
  };
  data.verify_key = Object.keys(data).join(",");
  const signed = {
    ...data,
    store_passwd: createHash("md5")
      .update(process.env.SSLCOMMERZ_STORE_PASSWORD)
      .digest("hex"),
  };
  delete signed.verify_key;
  data.verify_sign = createHash("md5")
    .update(
      Object.keys(signed)
        .sort()
        .map((key) => `${key}=${signed[key]}`)
        .join("&"),
    )
    .digest("hex");
  return data;
}

test("signature rejects forged and tampered callbacks", () => {
  assert.throws(() => paymentService.verifyCallbackSignature({}), /signature/);
  const data = notification();
  assert.doesNotThrow(() => paymentService.verifyCallbackSignature(data));
  data.status = "CANCELLED";
  assert.throws(
    () => paymentService.verifyCallbackSignature(data),
    /signature/,
  );
});

test("failure callback rejects an older attempt before writing", async () => {
  mock.method(prisma.payment, "findUnique", async () => payment);
  const write = mock.method(prisma.payment, "updateMany", async () => {
    throw Error("unexpected write");
  });
  await assert.rejects(
    paymentService.markPaymentFailed(
      payment.id,
      notification({ tran_id: "old-attempt" }),
    ),
    /does not match/,
  );
  assert.equal(write.mock.callCount(), 0);
});

test("late failure cannot overwrite a concurrently paid payment", async () => {
  mock.method(prisma.payment, "findUnique", async () => payment);
  mock.method(prisma.payment, "updateMany", async ({ where }) => {
    assert.equal(where.status, "PENDING");
    assert.equal(where.gatewayTransactionId, "attempt-1");
    return { count: 0 };
  });
  mock.method(prisma.payment, "findUniqueOrThrow", async () => ({
    ...payment,
    status: "PAID",
  }));
  const result = await paymentService.markPaymentFailed(
    payment.id,
    notification(),
  );
  assert.equal(result.status, "PAID");
});

test("successful payment requires matching provider amount and attempt", async () => {
  mock.method(prisma.payment, "findUnique", async () => payment);
  for (const mismatch of [
    { amount: "1" },
    { tran_id: "old-attempt" },
    { currency: "USD" },
  ]) {
    const fetchMock = mock.method(globalThis, "fetch", async () => ({
      ok: true,
      json: async () => ({
        status: "VALID",
        tran_id: "attempt-1",
        amount: "100.00",
        currency: "BDT",
        ...mismatch,
      }),
    }));
    await assert.rejects(
      paymentService.verifySuccessfulPayment(payment.id, "validation"),
      /verification failed/,
    );
    fetchMock.mock.restore();
  }
});

test("duplicate verified success does not apply the priority upgrade twice", async () => {
  mock.method(prisma.payment, "findUnique", async () => payment);
  mock.method(globalThis, "fetch", async () => ({
    ok: true,
    json: async () => ({
      status: "VALIDATED",
      tran_id: "attempt-1",
      amount: "100.00",
      currency: "BDT",
    }),
  }));
  let upgrades = 0;
  const tx = {
    payment: {
      updateMany: async () => ({ count: 0 }),
      findUniqueOrThrow: async () => ({ ...payment, status: "PAID" }),
    },
    complaint: {
      update: async () => {
        upgrades++;
      },
    },
  };
  mock.method(prisma, "$transaction", async (fn) => fn(tx));
  assert.equal(
    (await paymentService.verifySuccessfulPayment(payment.id, "validation"))
      .status,
    "PAID",
  );
  assert.equal(upgrades, 0);
});

test("concurrent retry cannot reset a payment that became paid", async () => {
  mock.method(prisma.complaint, "findFirst", async () => ({
    id: payment.complaintId,
    citizenId: payment.userId,
  }));
  mock.method(prisma.payment, "findUnique", async () => ({
    ...payment,
    status: "FAILED",
  }));
  mock.method(prisma.payment, "updateMany", async ({ where }) => {
    assert.equal(where.status, "FAILED");
    return { count: 0 };
  });
  await assert.rejects(
    paymentService.initiatePayment(payment.complaintId, payment.userId),
    /Payment changed/,
  );
});

test("pending initiation reuses the existing checkout instead of creating another", async () => {
  mock.method(prisma.complaint, "findFirst", async () => ({
    id: payment.complaintId,
    citizenId: payment.userId,
  }));
  mock.method(prisma.payment, "findUnique", async () => ({
    ...payment,
    gatewayUrl: "https://sandbox.sslcommerz.com/test",
  }));
  const gateway = mock.method(globalThis, "fetch", async () => {
    throw Error("unexpected gateway request");
  });
  const result = await paymentService.initiatePayment(
    payment.complaintId,
    payment.userId,
  );
  assert.equal(result.paymentId, payment.id);
  assert.equal(gateway.mock.callCount(), 0);
});
