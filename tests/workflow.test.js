const { test, afterEach, mock } = require("node:test");
const assert = require("node:assert/strict");
const unexpected = async () => {
  throw new Error("Unexpected database operation");
};
const prisma = {
  complaint: { findFirst: unexpected },
  user: { findFirst: unexpected },
  $transaction: unexpected,
};
require("../dist/config/prisma").prisma = prisma;
const {
  updateComplaintStatus,
  assignStaffToComplaint,
} = require("../dist/services/complaint.service");
afterEach(() => mock.restoreAll());

test("ASSIGNED requires an assigned staff member", async () => {
  mock.method(prisma.complaint, "findFirst", async () => ({
    id: "complaint",
    status: "UNDER_REVIEW",
    assignedToId: null,
  }));
  await assert.rejects(
    updateComplaintStatus("complaint", "ASSIGNED", "admin"),
    /Assign an active staff/,
  );
});

test("stale status update returns conflict without history or audit entries", async () => {
  const snapshot = {
    id: "complaint",
    status: "ASSIGNED",
    assignedToId: "staff",
    updatedAt: new Date(),
    resolvedAt: null,
  };
  mock.method(prisma.complaint, "findFirst", async () => snapshot);
  mock.method(prisma, "$transaction", async (fn) =>
    fn({
      complaint: {
        updateMany: async ({ where }) => {
          assert.equal(where.status, snapshot.status);
          assert.equal(where.assignedToId, snapshot.assignedToId);
          assert.equal(where.updatedAt, snapshot.updatedAt);
          assert.equal(where.deletedAt, null);
          return { count: 0 };
        },
      },
    }),
  );
  await assert.rejects(
    updateComplaintStatus("complaint", "IN_PROGRESS", "staff"),
    (error) => error.statusCode === 409,
  );
});

test("stale assignment cannot overwrite a complaint that progressed", async () => {
  mock.method(prisma.complaint, "findFirst", async () => ({
    id: "complaint",
    status: "UNDER_REVIEW",
    assignedToId: null,
    updatedAt: new Date(),
  }));
  mock.method(prisma.user, "findFirst", async () => ({
    id: "staff",
    name: "Staff",
  }));
  mock.method(prisma, "$transaction", async (fn) =>
    fn({ complaint: { updateMany: async () => ({ count: 0 }) } }),
  );
  await assert.rejects(
    assignStaffToComplaint("complaint", "staff", "admin"),
    (error) => error.statusCode === 409,
  );
});
