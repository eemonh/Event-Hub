import { Request, Response } from "express";
import User from "../models/User.js";

export async function createUser(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const user = await User.create({ name, email, password, role: role || "user" });
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function listUsers(req: Request, res: Response) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users: users.map((u) => ({ id: u._id, name: u.name, email: u.email, role: u.role, avatar: u.avatar, interests: u.interests, createdAt: u.createdAt })) });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateUserRole(req: Request, res: Response) {
  try {
    const { role } = req.body;
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, interests: user.interests } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
