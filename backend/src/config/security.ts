import { CookieOptions } from "express";
import { env } from "./env";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  domain: env.COOKIE_DOMAIN,
};

export const refreshTokenExpiresInDays = env.JWT_REFRESH_EXPIRES_DAYS;
