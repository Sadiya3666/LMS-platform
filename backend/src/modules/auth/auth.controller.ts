import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { registerSchema, loginSchema } from "./auth.validator";
import { cookieOptions } from "../../config/security";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registerSchema.parse(req.body);
    const user = await authService.registerUser(data);
    const { accessToken, refreshToken } = await authService.createSession(user.id);

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await authService.loginUser(data);
    const { accessToken, refreshToken } = await authService.createSession(user.id);

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(200).json({
      user: { id: user.id, email: user.email, name: user.name },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const { accessToken } = await authService.refreshSession(refreshToken);
    res.status(200).json({ accessToken });
  } catch (error) {
    res.clearCookie("refreshToken", cookieOptions);
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await authService.revokeSession(refreshToken);
    }
    res.clearCookie("refreshToken", cookieOptions);
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    next(error);
  }
};
