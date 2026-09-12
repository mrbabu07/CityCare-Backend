"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.loginUser = exports.registerUser = void 0;
const prisma_1 = require("../config/prisma");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const AppError_1 = require("../utils/AppError");
const jwt_2 = require("../utils/jwt");
const registerUser = async (data) => {
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { email: data.email }
    });
    if (existingUser) {
        throw new AppError_1.AppError("User already exists", 409);
    }
    const hashedPassword = await (0, password_1.hashPassword)(data.password);
    const user = await prisma_1.prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            phone: data.phone
        }
    });
    const accessToken = (0, jwt_1.generateAccessToken)({ userId: user.id, role: user.role });
    const refreshToken = (0, jwt_1.generateRefreshToken)({ userId: user.id, role: user.role });
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { email: data.email }
    });
    if (!user) {
        throw new AppError_1.AppError("Invalid email or password", 401);
    }
    const isPasswordValid = await (0, password_1.comparePassword)(data.password, user.password);
    if (!isPasswordValid) {
        throw new AppError_1.AppError("Invalid email or password", 401);
    }
    if (!user.isActive) {
        throw new AppError_1.AppError("User account is inactive", 403);
    }
    const accessToken = (0, jwt_1.generateAccessToken)({ userId: user.id, role: user.role });
    const refreshToken = (0, jwt_1.generateRefreshToken)({ userId: user.id, role: user.role });
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
};
exports.loginUser = loginUser;
const refreshAccessToken = async (token) => {
    let decoded;
    try {
        decoded = (0, jwt_1.verifyRefreshToken)(token);
    }
    catch {
        throw new AppError_1.AppError("Invalid or expired refresh token, Please login again", 401);
    }
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: decoded.userId }
    });
    if (!user || !user.isActive || user.deletedAt) {
        throw new AppError_1.AppError("User not found or inactive", 404);
    }
    const accessToken = (0, jwt_1.generateAccessToken)({ userId: user.id, role: user.role });
    return { accessToken };
};
exports.refreshAccessToken = refreshAccessToken;
//# sourceMappingURL=auth.service.js.map