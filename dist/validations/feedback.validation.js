"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeedbackSchema = void 0;
const zod_1 = require("zod");
exports.createFeedbackSchema = zod_1.z.object({
    body: zod_1.z.object({
        rating: zod_1.z.number().int().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
        comment: zod_1.z.string().optional(),
    })
});
//# sourceMappingURL=feedback.validation.js.map