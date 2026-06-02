import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import refreshRoutes from "./routes/refresh.js";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import userRoutes from "./routes/users.js";
import contactRoutes from "./routes/contact.js";
import analyticsRoutes from "./routes/analytics.js";
import User from "./models/User.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/refresh", refreshRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler — must have 4 params so Express recognises it as error middleware
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err.message);
  res
    .status((err as { status?: number }).status || 500)
    .json({ message: (err as Error).message || "Internal server error" });
});

async function ensureAdminAccount(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "Administrator";

  if (!adminEmail || !adminPassword) {
    return;
  }

  const existingUser = await User.findOne({ email: adminEmail }).select("+password");
  if (existingUser) {
    existingUser.role = "admin";
    existingUser.password = adminPassword;
    await existingUser.save();
    console.log(`Ensured admin account exists for ${adminEmail}.`);
    return;
  }

  const adminExists = await User.exists({ role: "admin" });
  if (adminExists) {
    console.log("Admin account already exists. No changes made.");
    return;
  }

  await User.create({
    name: adminName,
    email: adminEmail,
    password: adminPassword,
    role: "admin",
  });
  console.log(`Created default admin account: ${adminEmail}`);
}

async function start(): Promise<void> {
  await connectDB();
  await ensureAdminAccount();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
