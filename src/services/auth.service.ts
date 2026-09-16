import { prisma } from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { OAuth2Client } from "google-auth-library";
import { createHash } from "node:crypto";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const createSession = async (user: { id: string; role: string }) => {
  const accessToken = generateAccessToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken({
    userId: user.id,
    role: user.role,
  });
  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded.exp) throw new AppError("Refresh token expiry is missing", 500);

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: new Date(decoded.exp * 1000),
    },
  });

  return { accessToken, refreshToken };
};

export const googleLogin = async (idToken: string) => {
  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    throw new AppError("Invalid Google token", 401);
  }

  if (!payload || !payload.email) {
    throw new AppError("Could not retrieve information from Google", 401);
  }

  let user = await prisma.user.findUnique({ where: { email: payload.email } });

  if (!user) {
    const randomPassword = await hashPassword(
      Math.random().toString(36) + Date.now(),
    );
    user = await prisma.user.create({
      data: {
        name: payload.name || "Google User",
        email: payload.email,
        password: randomPassword,
      },
    });
  }

  if (!user.isActive) {
    throw new AppError("Your account has been deactivated", 403);
  }

  const tokens = await createSession(user);

  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, ...tokens };
};

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
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
      phone: data.phone,
    },
  });

  const tokens = await createSession(user);

  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, ...tokens };
};

export const loginUser = async (data: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("User account is inactive", 403);
  }

  const tokens = await createSession(user);

  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, ...tokens };
};

export const refreshAccessToken = async (token: string) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new AppError(
      "Invalid or expired refresh token, Please login again",
      401,
    );
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });

  if (
    !storedToken ||
    storedToken.userId !== decoded.userId ||
    storedToken.revokedAt ||
    storedToken.expiresAt <= new Date()
  ) {
    throw new AppError("Refresh token is invalid or has been revoked", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user || !user.isActive || user.deletedAt) {
    throw new AppError("User not found or inactive", 404);
  }

  const accessToken = generateAccessToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken({
    userId: user.id,
    role: user.role,
  });
  const nextDecoded = verifyRefreshToken(refreshToken);
  const nextExpiry = nextDecoded.exp;
  if (!nextExpiry) throw new AppError("Refresh token expiry is missing", 500);

  await prisma.$transaction(async (tx) => {
    const revoked = await tx.refreshToken.updateMany({
      where: { id: storedToken.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    if (revoked.count !== 1) {
      throw new AppError("Refresh token has already been used", 401);
    }

    await tx.refreshToken.create({
      data: {
        tokenHash: hashToken(refreshToken),
        userId: user.id,
        expiresAt: new Date(nextExpiry * 1000),
      },
    });
  });

  return { accessToken, refreshToken };
};

export const revokeRefreshToken = async (token: string, userId: string) => {
  await prisma.refreshToken.updateMany({
    where: {
      tokenHash: hashToken(token),
      userId,
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  });
};
