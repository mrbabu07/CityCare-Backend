"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditLog = void 0;
const prisma_1 = require("../config/prisma");
const createAuditLog = async (data) => {
    await prisma_1.prisma.auditLog.create({ data });
};
exports.createAuditLog = createAuditLog;
//# sourceMappingURL=auditLog.js.map