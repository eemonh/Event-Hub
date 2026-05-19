import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.userId);
    if (user) {
      req.user = user;
    }
  } catch {
    // Token invalid or expired — continue as anonymous
  }
  next();
}
