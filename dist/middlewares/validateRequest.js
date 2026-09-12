"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const validateRequest = (schema) => (req, res, next) => {
    schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
    });
    next();
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validateRequest.js.map