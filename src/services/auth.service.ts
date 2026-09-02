import { prisma } from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/password";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import {AppError} from "../utils/AppError";

export const registerUser = async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
}) => {
    const existingUser = await prisma.user.findUnique({
        where: {email: data.email}
    });

    if (existingUser) {
        throw new AppError("User already exists", 409);
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            phone: data.phone
        }
    });

    const accessToken = generateAccessToken({userId: user.id, role: user.role});
    const refreshToken = generateRefreshToken({userId: user.id, role: user.role});

    const {password, ...userWithoutPassword} = user;

    return { user: userWithoutPassword, accessToken, refreshToken };
};

export const loginUser = async (data: { email: string; password: string}) => {
    const user = await prisma.user.findUnique({
        where: {email: data.email}
    })

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await comparePassword(data.password, user.password);

    if(!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
    }

    if(!user.isActive) {
        throw new AppError("User account is inactive", 403);
    }

    const accessToken = generateAccessToken({userId: user.id, role: user.role});
    const refreshToken = generateRefreshToken({userId: user.id, role: user.role});

    const {password, ...userWithoutPassword} = user;

    return { user: userWithoutPassword, accessToken, refreshToken };
}