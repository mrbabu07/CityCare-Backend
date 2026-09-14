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
});
