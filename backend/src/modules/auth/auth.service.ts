import { prisma } from "../../config/db";
import { hashPassword, comparePassword } from "../../utils/password";
import { signAccessToken, generateRefreshToken, hashToken } from "../../utils/jwt";
import { refreshTokenExpiresInDays } from "../../config/security";

export const registerUser = async (data: any) => {
  const hashedPassword = await hashPassword(data.password);
  
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password_hash: hashedPassword,
      name: data.name,
    },
  });

  return user;
};

export const loginUser = async (data: any) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !(await comparePassword(data.password, user.password_hash))) {
    throw new Error("Invalid email or password");
  }

  return user;
};

export const createSession = async (userId: bigint) => {
  const accessToken = signAccessToken(userId);
  const refreshToken = generateRefreshToken();
  const tokenHash = hashToken(refreshToken);
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + refreshTokenExpiresInDays);

  await prisma.refreshToken.create({
    data: {
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    },
  });

  return { accessToken, refreshToken };
};

export const refreshSession = async (refreshToken: string) => {
  const tokenHash = hashToken(refreshToken);
  
  const storedToken = await prisma.refreshToken.findFirst({
    where: {
      token_hash: tokenHash,
      revoked_at: null,
      expires_at: { gt: new Date() },
    },
    include: { user: true },
  });

  if (!storedToken) {
    throw new Error("Invalid or expired refresh token");
  }

  const accessToken = signAccessToken(storedToken.user_id);
  return { accessToken };
};

export const revokeSession = async (refreshToken: string) => {
  const tokenHash = hashToken(refreshToken);
  
  await prisma.refreshToken.updateMany({
    where: { token_hash: tokenHash },
    data: { revoked_at: new Date() },
  });
};
