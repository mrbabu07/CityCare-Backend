"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiatePaymentSchema = void 0;
const zod_1 = require("zod");
exports.initiatePaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        complaintId: zod_1.z.string().uuid("Invalid Complaint Id")
    })
});
//# sourceMappingURL=payment.validation.js.map