import { Request, Response } from "express";
import User from "../models/User.js";
import Token from "../models/Token.js";
import generateToken, { generateRefreshToken } from "../utils/generateToken.js";

export async function register(req: Request, res: Response) {
  try {
    console.log("Register called with:", { name: req.body.name, email: req.body.email });
    const { name, email, password } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters" });
    }

    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return res.status(400).json({ message: "Password must contain at least one special character" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email: email.toLowerCase(), password, role: "user" });
    const token = generateToken(user._id);

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error: unknown) {
    console.error("Register error:", error instanceof Error ? error.message : error);
    if (error instanceof Error) {
      if ("name" in error && (error as any).name === "ValidationError") {
        const messages = Object.values((error as any).errors).map((e: any) => e.message);
        return res.status(400).json({ message: messages.join(", ") });
      }
      if (error.message.includes("secret is not configured")) {
        return res.status(500).json({ message: "Server configuration error. Please contact admin." });
      }
    }
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, interests: user.interests },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ message });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const { name, avatar, interests } = req.body;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (interests !== undefined) user.interests = interests;

    await user.save();

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, interests: user.interests },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ message });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ") && req.user) {
      const token = authHeader.split(" ")[1];
      await Token.create({
        token,
        type: "access",
        user: req.user._id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });
    }
    res.json({ message: "Logged out successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ message });
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    await Token.deleteMany({ user: user._id, type: "refresh" });

    res.json({ message: "Password changed successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ message });
  }
}
