import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Token from "../models/Token.js";
import generateToken from "../utils/generateToken.js";

export async function refreshAccess(req: Request, res: Response) {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const blacklisted = await Token.findOne({ token, type: "refresh" });
    if (blacklisted) {
      return res.status(401).json({ message: "Refresh token has been revoked" });
    }

    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "Refresh secret is not configured" });
    }
    const decoded = jwt.verify(token, secret) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const newAccessToken = generateToken(user._id);

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
}
