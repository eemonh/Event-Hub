import User from "../models/User.js";

export async function listUsers(req, res) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users: users.map((u) => ({ id: u._id, name: u.name, email: u.email, role: u.role, avatar: u.avatar, interests: u.interests, createdAt: u.createdAt })) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function listOrganizers(req, res) {
  try {
    const organizers = await User.find({ role: "organizer" }).select("-password").sort({ name: 1 });
    res.json({ users: organizers.map((u) => ({ id: u._id, name: u.name, email: u.email, role: u.role, avatar: u.avatar, bio: u.bio, interests: u.interests, createdAt: u.createdAt })) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateUserRole(req, res) {
  try {
    const { role } = req.body;
    if (!["admin", "user", "organizer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, interests: user.interests } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
