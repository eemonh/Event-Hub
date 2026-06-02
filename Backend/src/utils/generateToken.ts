import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export default function generateToken(userId: mongoose.Types.ObjectId | string, type = "access"): string {
  const secret = type === "refresh"
    ? process.env.JWT_REFRESH_SECRET
    : process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error(`JWT ${type} secret is not configured`);
  }

  const expiresIn = type === "refresh"
    ? process.env.JWT_REFRESH_EXPIRES || "7d"
    : process.env.JWT_ACCESS_EXPIRES || "15m";

  return jwt.sign({ userId: userId.toString() }, secret, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function generateRefreshToken(userId: mongoose.Types.ObjectId | string): string {
  return generateToken(userId, "refresh");
}
