import jwt from "jsonwebtoken";

export default function generateToken(userId, type = "access") {
  const secret = type === "refresh"
    ? process.env.JWT_REFRESH_SECRET
    : process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error(`JWT ${type} secret is not configured`);
  }

  const expiresIn = type === "refresh"
    ? process.env.JWT_REFRESH_EXPIRES || "7d"
    : process.env.JWT_ACCESS_EXPIRES || "15m";

  return jwt.sign({ userId }, secret, { expiresIn });
}

export function generateRefreshToken(userId) {
  return generateToken(userId, "refresh");
}