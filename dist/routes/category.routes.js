"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const category_validation_1 = require("../validations/category.validation");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.protect, category_controller_1.getAll);
router.get("/:id", auth_middleware_1.protect, category_controller_1.getOne);
router.post("/", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("ADMIN"), (0, validateRequest_1.validateRequest)(category_validation_1.createCategorySchema), category_controller_1.create);
router.patch("/:id", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("ADMIN"), (0, validateRequest_1.validateRequest)(category_validation_1.updateCategorySchema), category_controller_1.update);
router.delete("/:id", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("ADMIN"), category_controller_1.remove);
exports.default = router;
//# sourceMappingURL=category.routes.js.map