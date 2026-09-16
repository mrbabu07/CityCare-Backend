const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../dist/app").default;

test("health and structured 404 responses", async (t) => {
  const server = app.listen(0);
  t.after(() => server.close());
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();

  const root = await fetch(`http://127.0.0.1:${port}/`);
  const rootBody = await root.json();
  assert.equal(root.status, 200);
  assert.equal(rootBody.success, true);
  assert.equal(rootBody.message, "Welcome to the CityCare API");

  const health = await fetch(`http://127.0.0.1:${port}/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), {
    success: true,
    message: "Server is healthy",
    data: {},
  });

  const missing = await fetch(`http://127.0.0.1:${port}/missing`);
  const body = await missing.json();
  assert.equal(missing.status, 404);
  assert.equal(body.success, false);
  assert.ok(Array.isArray(body.errors));

  for (const [path, options, status] of [
    [
      "/api/v1/payments/webhook",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      },
      400,
    ],
    ["/api/v1/payments/fail/not-a-uuid", { method: "POST" }, 400],
    ["/api/v1/payments/result?status=made-up", {}, 400],
    ["/api/v1/users/me", {}, 401],
  ]) {
    const response = await fetch(`http://127.0.0.1:${port}${path}`, options);
    const result = await response.json();
    assert.equal(response.status, status);
    assert.equal(result.success, false);
    assert.ok(Array.isArray(result.errors));
  }
});
