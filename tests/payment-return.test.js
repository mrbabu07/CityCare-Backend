const { test, afterEach, mock } = require("node:test");
const assert = require("node:assert/strict");
const { paymentReturnUrl } = require("../dist/utils/paymentReturn");
const previous = process.env.FRONTEND_URL;
afterEach(() => {
  mock.restoreAll();
  if (previous === undefined) delete process.env.FRONTEND_URL;
  else process.env.FRONTEND_URL = previous;
});

test("verified browser callbacks redirect with 303; failed verification never claims success", async () => {
  process.env.FRONTEND_URL = "https://citycare.example";
  const express = require("express");
  const service = require("../dist/services/payment.service");
  const controller = require("../dist/controllers/payment.controller");
  const app = express();
  app.use(express.json());
  app.post("/success/:paymentId", controller.success);
  app.post("/cancel/:paymentId", controller.cancel);
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    mock.method(service, "verifySuccessfulPayment", async () => ({
      id: "p1",
      status: "PAID",
      complaintId: "c1",
    }));
    const success = await fetch(`${origin}/success/p1`, {
      method: "POST",
      redirect: "manual",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ val_id: "validated" }),
    });
    assert.equal(success.status, 303);
    const location = new URL(success.headers.get("location"));
    assert.equal(location.searchParams.get("complaintId"), "c1");
    assert.equal(location.searchParams.get("outcome"), "success");
    mock.method(service, "markPaymentFailed", async () => {
      throw new Error("Invalid signature");
    });
    const cancelled = await fetch(`${origin}/cancel/p1`, {
      method: "POST",
      redirect: "manual",
    });
    assert.equal(cancelled.status, 303);
    assert.equal(
      new URL(cancelled.headers.get("location")).searchParams.get("outcome"),
      "unverified",
    );
    assert.equal(
      new URL(cancelled.headers.get("location")).searchParams.has(
        "complaintId",
      ),
      false,
    );
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});

test("payment redirects use only the configured origin", () => {
  process.env.FRONTEND_URL = "https://citycare.example/ignored?redirect=evil";
  const url = new URL(paymentReturnUrl("success", "a&outcome=failed"));
  assert.equal(url.origin, "https://citycare.example");
  assert.equal(url.pathname, "/payment/result");
  assert.equal(url.searchParams.get("complaintId"), "a&outcome=failed");
  assert.equal(url.searchParams.get("outcome"), "success");
});
test("missing configuration retains JSON callbacks", () => {
  delete process.env.FRONTEND_URL;
  assert.equal(paymentReturnUrl("unverified"), null);
});
test("unsafe frontend origins are rejected", () => {
  for (const origin of [
    "javascript:alert(1)",
    "http://example.com",
    "https://user:secret@example.com",
  ]) {
    process.env.FRONTEND_URL = origin;
    assert.throws(() => paymentReturnUrl("success"));
  }
  process.env.FRONTEND_URL = "http://localhost:3008";
  assert.match(
    paymentReturnUrl("cancelled"),
    /^http:\/\/localhost:3008\/payment\/result/,
  );
});
