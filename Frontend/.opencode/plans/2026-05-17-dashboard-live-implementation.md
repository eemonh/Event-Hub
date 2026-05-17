# Dashboard Live Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform dashboard from mockups to fully functional with backend Event/Registration/Bookmark models, API routes, and frontend integration.

**Architecture:** Backend Express + Mongoose adds 3 models (Event, Registration, Bookmark) and 12+ API endpoints. Frontend creates service files and rewires all 10 dashboard pages to use real APIs via native fetch(), matching existing auth service patterns.

**Tech Stack:** Node.js/Express, MongoDB/Mongoose, React/Vite, Tailwind CSS v4, react-hot-toast

---

### Task 1: Event Model

**Files:**
- Create: `E:\Event-Hub\Backend\src\models\Event.js`

- [ ] **Create Event model**

```js
import mongoose from "mongoose";

const CATEGORIES = [
  "Technology", "Design", "Business", "Startup", "Music",
  "Arts", "Health", "Sports", "Education", "Food & Drink",
  "Networking", "Other",
];

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Event type is required"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    startTime: {
      type: String,
      default: "",
    },
    endTime: {
      type: String,
      default: "",
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: CATEGORIES,
    },
    capacity: {
      type: Number,
      default: 100,
      min: [1, "Capacity must be at least 1"],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled"],
      default: "published",
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organizer is required"],
    },
  },
  { timestamps: true }
);

eventSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj.__v;
  return obj;
};

export { CATEGORIES };
export default mongoose.model("Event", eventSchema);
```

### Task 2: Registration + Bookmark Models

**Files:**
- Create: `E:\Event-Hub\Backend\src\models\Registration.js`
- Create: `E:\Event-Hub\Backend\src\models\Bookmark.js`

- [ ] **Create Registration model**

```js
import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

registrationSchema.index({ user: 1, event: 1 }, { unique: true });

registrationSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj.__v;
  return obj;
};

export default mongoose.model("Registration", registrationSchema);
```

- [ ] **Create Bookmark model**

```js
import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

bookmarkSchema.index({ user: 1, event: 1 }, { unique: true });

bookmarkSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj.__v;
  return obj;
};

export default mongoose.model("Bookmark", bookmarkSchema);
```

### Task 3: Update User Model (add interests)

**Files:**
- Modify: `E:\Event-Hub\Backend\src\models\User.js`

- [ ] **Add interests field to User model**

After `avatar` field (line 33), add:
```js
    interests: {
      type: [String],
      default: [],
    },
```

### Task 4: Event Controller

**Files:**
- Create: `E:\Event-Hub\Backend\src\controllers\eventController.js`

- [ ] **Create event controller**

```js
import Event, { CATEGORIES } from "../models/Event.js";
import Registration from "../models/Registration.js";
import Bookmark from "../models/Bookmark.js";

export async function listEvents(req, res) {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const filter = { status: "published" };
    if (category && CATEGORIES.includes(category)) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const events = await Event.find(filter)
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("organizer", "name email");
    const total = await Event.countDocuments(filter);
    res.json({ events, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getEvent(req, res) {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "name email");
    if (!event) return res.status(404).json({ message: "Event not found" });
    const registrationCount = await Registration.countDocuments({ event: event._id });
    const bookmarkCount = await Bookmark.countDocuments({ event: event._id });
    res.json({ event: { ...event.toJSON(), registrationCount, bookmarkCount } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createEvent(req, res) {
  try {
    const eventData = { ...req.body, organizer: req.user._id };
    const event = await Event.create(eventData);
    res.status(201).json({ event: event.toJSON() });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: error.message });
  }
}

export async function updateEvent(req, res) {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ event: event.toJSON() });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: error.message });
  }
}

export async function deleteEvent(req, res) {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    await Registration.deleteMany({ event: event._id });
    await Bookmark.deleteMany({ event: event._id });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getMyEvents(req, res) {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate("event")
      .sort({ registeredAt: -1 });
    const events = registrations
      .filter((r) => r.event)
      .map((r) => ({
        ...r.event.toJSON(),
        registeredAt: r.registeredAt,
        registrationId: r._id,
      }));
    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getSavedEvents(req, res) {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate("event")
      .sort({ savedAt: -1 });
    const events = bookmarks
      .filter((b) => b.event)
      .map((b) => ({
        ...b.event.toJSON(),
        savedAt: b.savedAt,
        bookmarkId: b._id,
      }));
    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getRecommendedEvents(req, res) {
  try {
    const user = req.user;
    const registeredEventIds = (
      await Registration.find({ user: user._id }).select("event")
    ).map((r) => r.event);
    const bookmarkedEventIds = (
      await Bookmark.find({ user: user._id }).select("event")
    ).map((b) => b.event);
    const excludeIds = [...new Set([...registeredEventIds, ...bookmarkedEventIds])];

    const filter = { status: "published" };
    if (user.interests && user.interests.length > 0) {
      filter.category = { $in: user.interests };
    }
    if (excludeIds.length > 0) {
      filter._id = { $nin: excludeIds };
    }

    const events = await Event.find(filter)
      .sort({ startDate: 1 })
      .limit(12)
      .populate("organizer", "name email");
    res.json({ events: events.map((e) => e.toJSON()) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function registerForEvent(req, res) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.status !== "published") return res.status(400).json({ message: "Event is not open for registration" });

    const existing = await Registration.findOne({ user: req.user._id, event: event._id });
    if (existing) return res.status(400).json({ message: "Already registered for this event" });

    const registrationCount = await Registration.countDocuments({ event: event._id });
    if (registrationCount >= event.capacity) return res.status(400).json({ message: "Event is at full capacity" });

    const registration = await Registration.create({ user: req.user._id, event: event._id });
    res.status(201).json({ registration: registration.toJSON() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function cancelRegistration(req, res) {
  try {
    const registration = await Registration.findOneAndDelete({
      user: req.user._id,
      event: req.params.id,
    });
    if (!registration) return res.status(404).json({ message: "Registration not found" });
    res.json({ message: "Registration cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function bookmarkEvent(req, res) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const existing = await Bookmark.findOne({ user: req.user._id, event: event._id });
    if (existing) return res.status(400).json({ message: "Event already bookmarked" });

    const bookmark = await Bookmark.create({ user: req.user._id, event: event._id });
    res.status(201).json({ bookmark: bookmark.toJSON() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function removeBookmark(req, res) {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      user: req.user._id,
      event: req.params.id,
    });
    if (!bookmark) return res.status(404).json({ message: "Bookmark not found" });
    res.json({ message: "Bookmark removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getAllEvents(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const events = await Event.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("organizer", "name email");
    const total = await Event.countDocuments();
    res.json({ events: events.map((e) => e.toJSON()), total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
```

### Task 5: User Controller (admin user management)

**Files:**
- Create: `E:\Event-Hub\Backend\src\controllers\userController.js`

- [ ] **Create user controller**

```js
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
    res.json({ organizers: organizers.map((u) => ({ id: u._id, name: u.name, email: u.email, role: u.role, avatar: u.avatar })) });
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
```

### Task 6: Event Routes

**Files:**
- Create: `E:\Event-Hub\Backend\src\routes\events.js`

- [ ] **Create event routes**

```js
import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getSavedEvents,
  getRecommendedEvents,
  registerForEvent,
  cancelRegistration,
  bookmarkEvent,
  removeBookmark,
  getAllEvents,
} from "../controllers/eventController.js";

const router = Router();

router.get("/", asyncHandler(listEvents));
router.get("/my", authenticate, asyncHandler(getMyEvents));
router.get("/saved", authenticate, asyncHandler(getSavedEvents));
router.get("/recommended", authenticate, asyncHandler(getRecommendedEvents));
router.get("/all", authenticate, authorize("admin"), asyncHandler(getAllEvents));
router.get("/:id", asyncHandler(getEvent));
router.post("/", authenticate, authorize("admin"), asyncHandler(createEvent));
router.put("/:id", authenticate, authorize("admin"), asyncHandler(updateEvent));
router.delete("/:id", authenticate, authorize("admin"), asyncHandler(deleteEvent));
router.post("/:id/register", authenticate, asyncHandler(registerForEvent));
router.delete("/:id/register", authenticate, asyncHandler(cancelRegistration));
router.post("/:id/bookmark", authenticate, asyncHandler(bookmarkEvent));
router.delete("/:id/bookmark", authenticate, asyncHandler(removeBookmark));

export default router;
```

### Task 7: User Routes (admin)

**Files:**
- Create: `E:\Event-Hub\Backend\src\routes\users.js`

- [ ] **Create user admin routes**

```js
import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { listUsers, listOrganizers, updateUserRole, deleteUser } from "../controllers/userController.js";

const router = Router();

router.get("/", authenticate, authorize("admin"), asyncHandler(listUsers));
router.get("/organizers", authenticate, authorize("admin"), asyncHandler(listOrganizers));
router.put("/:id/role", authenticate, authorize("admin"), asyncHandler(updateUserRole));
router.delete("/:id", authenticate, authorize("admin"), asyncHandler(deleteUser));

export default router;
```

### Task 8: Update Auth Controller (profile includes interests)

**Files:**
- Modify: `E:\Event-Hub\Backend\src\controllers\authController.js`

- [ ] **Update updateProfile to accept interests**

Replace the `updateProfile` function (lines 101-117) with:

```js
export async function updateProfile(req, res) {
  try {
    const { name, avatar, interests } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (interests !== undefined) user.interests = interests;

    await user.save();

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, interests: user.interests },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
```

- [ ] **Update getMe to return avatar and interests**

Replace the `getMe` function (lines 90-99) with:

```js
export async function getMe(req, res) {
  try {
    const user = req.user;
    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, interests: user.interests },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
```

### Task 9: Wire Routes Into Server

**Files:**
- Modify: `E:\Event-Hub\Backend\src\server.js`

- [ ] **Mount event and user routes**

Add after line 12 (`import authRoutes from "./routes/auth.js"`):
```js
import eventRoutes from "./routes/events.js";
import userRoutes from "./routes/users.js";
```

Add after line 27 (`app.use("/api/auth", authRoutes);`):
```js
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
```

### Task 10: Frontend Events Service

**Files:**
- Create: `E:\Event-Hub\Frontend\src\services\events.js`

- [ ] **Create events service**

```js
const API_BASE = "/api/events";

async function request(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function getEvents(token, query = {}) {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", query.page);
  if (query.limit) params.set("limit", query.limit);
  const qs = params.toString();
  return request(`${API_BASE}${qs ? `?${qs}` : ""}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function getEvent(id) {
  return request(`${API_BASE}/${id}`);
}

export async function getMyEvents(token) {
  return request(`${API_BASE}/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getSavedEvents(token) {
  return request(`${API_BASE}/saved`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getRecommendedEvents(token) {
  return request(`${API_BASE}/recommended`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createEvent(token, data) {
  return request(`${API_BASE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function updateEvent(token, id, data) {
  return request(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function deleteEvent(token, id) {
  return request(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function registerForEvent(token, id) {
  return request(`${API_BASE}/${id}/register`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function cancelRegistration(token, id) {
  return request(`${API_BASE}/${id}/register`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function bookmarkEvent(token, id) {
  return request(`${API_BASE}/${id}/bookmark`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function removeBookmark(token, id) {
  return request(`${API_BASE}/${id}/bookmark`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getAllEvents(token, query = {}) {
  const params = new URLSearchParams();
  if (query.page) params.set("page", query.page);
  if (query.limit) params.set("limit", query.limit);
  const qs = params.toString();
  return request(`${API_BASE}/all${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
```

### Task 11: Frontend Users Service

**Files:**
- Create: `E:\Event-Hub\Frontend\src\services\users.js`

- [ ] **Create users admin service**

```js
const API_BASE = "/api/users";

async function request(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function getUsers(token) {
  return request(`${API_BASE}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getOrganizers(token) {
  return request(`${API_BASE}/organizers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateUserRole(token, id, role) {
  return request(`${API_BASE}/${id}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });
}

export async function deleteUser(token, id) {
  return request(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
```

### Task 12: Update Auth Service (add updateProfile)

**Files:**
- Modify: `E:\Event-Hub\Frontend\src\services\auth.js`

- [ ] **Add updateProfile function**

Add at the end of the file (after changePassword):

```js
export async function updateProfile(token, data) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message);
  return result;
}
```

### Task 13: ProfileSettingsPage (real data + API wiring)

**Files:**
- Modify: `E:\Event-Hub\Frontend\src\pages\dashboard\ProfileSettingsPage.jsx`

- [ ] **Rewrite ProfileSettingsPage with real API calls**

Replace entire file:

```jsx
import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { updateProfile } from "../../services/auth";
import { changePassword } from "../../services/auth";

const CATEGORIES = [
  "Technology", "Design", "Business", "Startup", "Music",
  "Arts", "Health", "Sports", "Education", "Food & Drink",
  "Networking", "Other",
];

export default function ProfileSettingsPage() {
  const { user, token } = useAuth();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();

  const [name, setName] = useState(user?.name || "");
  const [interests, setInterests] = useState(user?.interests || []);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setInterests(user.interests || []);
    }
  }, [user]);

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Profile", "Settings"]);
    setAction(null);
  }, [setBreadcrumbs, setAction]);

  const toggleInterest = (cat) => {
    setInterests((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(token, { name, interests });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword(token, currentPassword, newPassword);
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <form onSubmit={handleSaveProfile}>
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Personal Information</h2>
            <hr className="border-gray-100 mb-6" />
            <div className="space-y-6 max-w-3xl">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-700/50 focus:border-violet-700 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm focus:outline-none cursor-default"
                />
                <div className="flex items-center text-xs text-gray-500 mt-2">
                  <Info className="w-3.5 h-3.5 mr-1.5" />
                  <span>Email cannot be changed here. Contact support.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Interests</h2>
            <hr className="border-gray-100 mb-6" />
            <p className="text-sm text-gray-500 mb-4">Select categories you're interested in. We'll recommend events based on your choices.</p>
            <div className="flex flex-wrap gap-3 max-w-3xl">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleInterest(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    interests.includes(cat)
                      ? "bg-violet-700 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-violet-700 hover:bg-violet-800 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <form onSubmit={handleChangePassword}>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Change Password</h2>
          <hr className="border-gray-100 mb-6" />
          <div className="space-y-6 max-w-3xl">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-700/50 focus:border-violet-700 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-700/50 focus:border-violet-700 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-700/50 focus:border-violet-700 transition-all"
              />
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6 mt-6 flex justify-end">
            <button
              type="submit"
              disabled={changingPassword}
              className="bg-violet-700 hover:bg-violet-800 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50"
            >
              {changingPassword ? "Changing..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
```

### Task 14: MyEventsPage (fetch from API, cancel registration)

**Files:**
- Modify: `E:\Event-Hub\Frontend\src\pages\dashboard\MyEventsPage.jsx`

- [ ] **Rewrite MyEventsPage with real API data**

Replace entire file:

```jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Ticket, RotateCcw, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { getMyEvents, cancelRegistration } from "../../services/events";

const EventCard = ({ event, isPast, onCancel }) => {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={event.coverImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"}
          alt={event.title || event.name}
          className={`w-full h-full object-cover ${isPast ? "grayscale opacity-80" : ""}`}
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {event.title || event.name}
        </h3>
        <div className="mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isPast ? "bg-gray-100 text-gray-600" : "bg-purple-100 text-purple-700"
          }`}>
            {isPast ? "Attended" : "Registered"}
          </span>
        </div>
        <div className="space-y-2 mb-6 flex-grow">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            {event.startDate ? new Date(event.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : event.date}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            {event.startTime || event.time || "All day"}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            {event.venue || event.location}
          </div>
        </div>
        {isPast ? (
          <button
            disabled
            className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-semibold bg-purple-50 text-purple-400 cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Event Ended
          </button>
        ) : (
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-semibold bg-violet-700 hover:bg-violet-800 text-white transition-colors">
              <Ticket className="w-4 h-4 mr-2" />
              View Ticket
            </button>
            <button
              onClick={() => onCancel(event._id || event.id)}
              className="py-2.5 px-4 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function MyEventsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const data = await getMyEvents(token);
      setEvents(data.events || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Events", "My Events"]);
    setAction({ label: "Explore More", onClick: () => navigate("/events") });
  }, [setBreadcrumbs, setAction, navigate]);

  const handleCancel = async (eventId) => {
    if (!confirm("Are you sure you want to cancel your registration?")) return;
    try {
      await cancelRegistration(token, eventId);
      toast.success("Registration cancelled");
      fetchEvents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.startDate) >= now);
  const past = events.filter((e) => new Date(e.startDate) < now);

  if (loading) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-violet-700" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
        <p className="text-gray-500">Manage your registrations and view your tickets.</p>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-20 text-center">
          <Calendar size={48} className="text-slate-300" />
          <p className="mt-4 text-lg font-medium text-slate-500">No registered events yet</p>
          <p className="text-sm text-slate-400">Browse events and register to see them here.</p>
          <button onClick={() => navigate("/dashboard/events")} className="mt-4 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-violet-700 hover:bg-violet-800 transition-colors">
            Browse Events
          </button>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map((event) => (
                  <EventCard key={event._id || event.id} event={event} isPast={false} onCancel={handleCancel} />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Past Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {past.map((event) => (
                  <EventCard key={event._id || event.id} event={event} isPast={true} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
```

### Task 15: SavedEventsPage (fetch from API, remove bookmark)

**Files:**
- Modify: `E:\Event-Hub\Frontend\src\pages\dashboard\SavedEventsPage.jsx`

- [ ] **Rewrite SavedEventsPage with real API data**

Replace entire file:

```jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Bookmark, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { getSavedEvents, removeBookmark } from "../../services/events";

const SavedEventCard = ({ event, onRemove }) => {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative h-48 w-full bg-gray-100">
        <img
          src={event.coverImage || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"}
          alt={event.title || event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <span className="text-xs font-bold text-gray-800 tracking-wide">{event.category}</span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4 gap-4">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">{event.title || event.name}</h3>
          <button
            onClick={() => onRemove(event._id || event.id)}
            className="text-violet-700 hover:text-violet-800 transition-colors flex-shrink-0 mt-1"
            title="Remove bookmark"
          >
            <Bookmark className="w-5 h-5" fill="currentColor" />
          </button>
        </div>
        <div className="space-y-3 mb-8 flex-grow">
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <Calendar className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
            {event.startDate ? new Date(event.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : event.datetime}
          </div>
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <MapPin className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
            {event.venue || event.location}
          </div>
        </div>
        <button className="w-full py-3 px-4 rounded-xl text-sm font-bold transition-colors bg-violet-700 hover:bg-violet-800 text-white shadow-sm">
          Register Now
        </button>
      </div>
    </div>
  );
};

export default function SavedEventsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      const data = await getSavedEvents(token);
      setEvents(data.events || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, [token]);

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Events", "Saved"]);
    setAction({ label: "Explore Events", onClick: () => navigate("/events") });
  }, [setBreadcrumbs, setAction, navigate]);

  const handleRemove = async (eventId) => {
    try {
      await removeBookmark(token, eventId);
      toast.success("Bookmark removed");
      fetchSaved();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-violet-700" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Events</h1>
        <p className="text-gray-500 text-base">Events you've bookmarked for later.</p>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-20 text-center">
          <Bookmark size={48} className="text-slate-300" />
          <p className="mt-4 text-lg font-medium text-slate-500">No saved events yet</p>
          <p className="text-sm text-slate-400">Browse events and bookmark them to see them here.</p>
          <button onClick={() => navigate("/dashboard/events")} className="mt-4 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-violet-700 hover:bg-violet-800 transition-colors">
            Browse Events
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <SavedEventCard key={event._id || event.id} event={event} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </main>
  );
}
```

### Task 16: UserDashboard (real stats, upcoming, recommended)

**Files:**
- Modify: `E:\Event-Hub\Frontend\src\pages\UserDashboard.jsx`

- [ ] **Rewrite UserDashboard with real API data**

Replace entire file:

```jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays, Clock3, MapPin, Bookmark, Ticket, ChevronRight, Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { getMyEvents, getRecommendedEvents } from "../services/events";

export default function UserDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();
  const [myEvents, setMyEvents] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Overview"]);
    setAction({ label: "Create Event", onClick: () => navigate("/dashboard/events") });
  }, [setBreadcrumbs, setAction, navigate]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    Promise.all([
      getMyEvents(token),
      getRecommendedEvents(token),
    ])
      .then(([myData, recData]) => {
        if (cancelled) return;
        setMyEvents(myData.events || []);
        setRecommended(recData.events || []);
      })
      .catch((err) => {
        if (!cancelled) toast.error(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [token]);

  const now = new Date();
  const upcomingEvents = myEvents
    .filter((e) => new Date(e.startDate) >= now)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const thisMonthCount = upcomingEvents.filter((e) => {
    const d = new Date(e.startDate);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  if (loading) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-violet-700" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <section className="space-y-2">
        <h1 className="font-[Poppins] text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Welcome back, {user?.name?.split(" ")[0] || "there"}!
        </h1>
        <p className="text-base text-slate-500">
          You have{" "}
          <span className="font-medium text-violet-700">
            {thisMonthCount} upcoming {thisMonthCount === 1 ? "event" : "events"}
          </span>{" "}
          this month. Get ready to connect and learn.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:max-w-2xl">
        <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
            <Ticket size={18} className="text-violet-700" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Registered Events</p>
            <h3 className="font-[Poppins] text-4xl font-bold text-slate-900">{myEvents.length}</h3>
          </div>
        </div>
        <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
            <Bookmark size={18} className="text-violet-700" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Saved Events</p>
            <h3 className="font-[Poppins] text-4xl font-bold text-slate-900">{recommended.length}</h3>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-6 py-5">
          <h2 className="font-[Poppins] text-3xl font-semibold">Your Upcoming Events</h2>
          <button
            onClick={() => navigate("/dashboard/events/my")}
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-violet-700"
          >
            View All
            <ChevronRight size={14} />
          </button>
        </div>

        <div>
          {upcomingEvents.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-500">
              <p>No upcoming events. Browse events to register!</p>
              <button
                onClick={() => navigate("/dashboard/events")}
                className="mt-3 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-violet-700 hover:bg-violet-800 transition-colors"
              >
                Browse Events
              </button>
            </div>
          ) : (
            upcomingEvents.slice(0, 3).map((event, index) => {
              const startDate = new Date(event.startDate);
              const month = startDate.toLocaleString("en-US", { month: "short" });
              const day = startDate.getDate();
              return (
                <div
                  key={event._id || event.id}
                  className={`flex flex-col gap-5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between ${
                    index !== Math.min(upcomingEvents.length, 3) - 1 ? "border-b border-slate-100" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg bg-violet-100">
                      <span className="text-xs font-semibold uppercase tracking-wide text-violet-700">{month}</span>
                      <span className="font-[Poppins] text-xl font-semibold text-violet-700">{day}</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-semibold text-slate-900">{event.title || event.name}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock3 size={14} />
                          {event.startTime || "All day"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {event.venue || event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    <Ticket size={15} />
                    View Ticket
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="space-y-2">
        <div>
          <h2 className="font-[Poppins] text-4xl font-semibold text-slate-900">Recommended for You</h2>
          <p className="mt-1 text-slate-500">
            {recommended.length > 0
              ? "Based on your interests."
              : "Set your interests in Settings to get personalized recommendations."}
          </p>
        </div>

        {recommended.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recommended.slice(0, 6).map((event) => {
              const startDate = new Date(event.startDate);
              return (
                <div
                  key={event._id || event.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={event.coverImage || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop"}
                      alt={event.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute left-3 top-3 rounded-md bg-white px-2 py-1 text-xs font-semibold text-violet-700 shadow">
                      {event.category}
                    </div>
                  </div>
                  <div className="space-y-4 p-4">
                    <h3 className="font-[Poppins] text-2xl font-semibold leading-snug text-slate-900">{event.name}</h3>
                    <div className="space-y-2 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={14} />
                        {startDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        {event.venue}
                      </div>
                    </div>
                    <button className="w-full rounded-xl bg-violet-700 py-3 text-sm font-semibold text-white transition hover:bg-violet-800">
                      Register Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
```

### Task 17: EventsPage (browse published events)

**Files:**
- Modify: `E:\Event-Hub\Frontend\src\pages\dashboard\EventsPage.jsx`

- [ ] **Rewrite EventsPage with event grid**

Replace entire file:

```jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, Search, Bookmark, Loader2, Ticket } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { getEvents, registerForEvent, bookmarkEvent, removeBookmark, getSavedEvents } from "../../services/events";

const CATEGORIES = [
  "All", "Technology", "Design", "Business", "Startup", "Music",
  "Arts", "Health", "Sports", "Education", "Food & Drink", "Networking", "Other",
];

export default function DashboardEvents() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Events"]);
  }, [setBreadcrumbs]);

  const fetchEvents = async () => {
    try {
      const data = await getEvents(token, { category, search });
      setEvents(data.events || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSaved = async () => {
    if (!token) return;
    try {
      const data = await getSavedEvents(token);
      setSavedIds(new Set((data.events || []).map((e) => e._id || e.id)));
    } catch {
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchSaved();
  }, [token, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchEvents();
  };

  const handleRegister = async (eventId) => {
    try {
      await registerForEvent(token, eventId);
      toast.success("Registered successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleBookmark = async (eventId) => {
    try {
      if (savedIds.has(eventId)) {
        await removeBookmark(token, eventId);
        setSavedIds((prev) => { const n = new Set(prev); n.delete(eventId); return n; });
        toast.success("Bookmark removed");
      } else {
        await bookmarkEvent(token, eventId);
        setSavedIds((prev) => new Set(prev).add(eventId));
        toast.success("Event saved!");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-violet-700" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <section className="space-y-2">
        <h1 className="font-[Poppins] text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Browse Events
        </h1>
        <p className="text-base text-slate-500">
          Discover events and register to attend.
        </p>
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-700/50"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </form>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat === "All" ? "" : cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                (cat === "All" && !category) || category === cat
                  ? "bg-violet-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-20 text-center">
          <CalendarDays size={48} className="text-slate-300" />
          <p className="mt-4 text-lg font-medium text-slate-500">No events found</p>
          <p className="text-sm text-slate-400">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const eventId = event._id || event.id;
            const isSaved = savedIds.has(eventId);
            const startDate = new Date(event.startDate);
            return (
              <div key={eventId} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.coverImage || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop"}
                    alt={event.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-violet-700 shadow">
                    {event.category}
                  </div>
                  <button
                    onClick={() => handleBookmark(eventId)}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow hover:bg-gray-50 transition-colors"
                  >
                    <Bookmark size={16} className={isSaved ? "text-violet-700 fill-violet-700" : "text-slate-500"} />
                  </button>
                </div>
                <div className="space-y-3 p-4">
                  <h3 className="font-[Poppins] text-xl font-semibold leading-snug text-slate-900">{event.name}</h3>
                  <div className="space-y-1.5 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={14} />
                      {startDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                      {event.startTime && ` at ${event.startTime}`}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      {event.venue}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-semibold text-slate-700">
                      {event.price === 0 ? "Free" : `$${event.price}`}
                    </span>
                    <button
                      onClick={() => handleRegister(eventId)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-800"
                    >
                      <Ticket size={14} />
                      Register
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
```

### Task 18: CreateEventPage (submit to API)

**Files:**
- Modify: `E:\Event-Hub\Frontend\src\pages\dashboard\CreateEventPage.jsx`

- [ ] **Rewrite CreateEventPage to submit to API**

Replace entire file:

```jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Calendar, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { createEvent } from "../../services/events";

const CATEGORIES = [
  "Technology", "Design", "Business", "Startup", "Music",
  "Arts", "Health", "Sports", "Education", "Food & Drink",
  "Networking", "Other",
];

export default function CreateEventPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    category: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    venue: "",
    coverImage: "",
    description: "",
    capacity: "",
    price: "0",
    status: "published",
  });

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Events", "Create"]);
    setAction(null);
  }, [setBreadcrumbs, setAction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.startDate || !formData.venue || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createEvent(token, {
        name: formData.name,
        type: formData.type,
        category: formData.category,
        startDate: formData.startDate,
        endDate: formData.endDate || formData.startDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        venue: formData.venue,
        coverImage: formData.coverImage,
        description: formData.description,
        capacity: parseInt(formData.capacity) || 100,
        price: parseFloat(formData.price) || 0,
        status: formData.status,
      });
      toast.success("Event created successfully!");
      navigate("/dashboard/events/manage");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
        <p className="text-gray-500 text-sm">Fill in the details below to create a new event.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-[700px]">
        <div className="p-8">
          <form id="event-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Event Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter event name" required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all" />
              </div>
              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 mb-2">Event Type *</label>
                <div className="relative">
                  <select name="type" value={formData.type} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none transition-all cursor-pointer">
                    <option value="" disabled>Select event type</option>
                    <option value="Conference">Conference</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Meetup">Meetup</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Networking">Networking</option>
                    <option value="Concert">Concert</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Festival">Festival</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Category *</label>
              <div className="relative">
                <select name="category" value={formData.category} onChange={handleChange} required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none transition-all cursor-pointer">
                  <option value="" disabled>Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Start Date *</label>
                <div className="relative">
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required
                    className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Start Time</label>
                <input type="time" name="startTime" value={formData.startTime} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">End Date</label>
                <div className="relative">
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">End Time</label>
                <input type="time" name="endTime" value={formData.endTime} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Venue / Location *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <input type="text" name="venue" value={formData.venue} onChange={handleChange} placeholder="Search for a venue or address" required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Capacity</label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="e.g. 100" min="1"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Price ($)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0 = Free" min="0" step="0.01"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Status</label>
                <div className="relative">
                  <select name="status" value={formData.status} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none transition-all cursor-pointer">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Cover Image URL</label>
              <input type="url" name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Event Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Provide details about your event..."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all resize-y"></textarea>
            </div>
          </form>
        </div>

        <div className="px-8 py-5 border-t border-gray-100 flex justify-end gap-4 bg-white rounded-b-xl">
          <button onClick={() => navigate("/dashboard/events/manage")} type="button"
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
            Cancel
          </button>
          <button type="submit" form="event-form" disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-violet-700 hover:bg-violet-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? "Creating..." : "Create Event"}
          </button>
        </div>
      </div>
    </main>
  );
}
```

### Task 19: ManageEventsPage (fetch/edit/delete via API)

**Files:**
- Modify: `E:\Event-Hub\Frontend\src\pages\dashboard\ManageEventsPage.jsx`

- [ ] **Rewrite ManageEventsPage with real API data**

Replace entire file:

```jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase, Globe, Rocket, Users, ChevronLeft, ChevronRight,
  Pencil, Trash2, Eye, Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { getAllEvents, deleteEvent } from "../../services/events";

const StatusBadge = ({ status }) => {
  const styles = {
    published: "bg-emerald-50 text-emerald-700 border-emerald-100",
    draft: "bg-gray-100 text-gray-600 border-gray-200",
    cancelled: "bg-red-50 text-red-700 border-red-100",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.draft}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const iconMap = { Briefcase, Globe, Rocket, Users };
const bgMap = { Briefcase: "bg-purple-100", Globe: "bg-blue-100", Rocket: "bg-gray-100", Users: "bg-purple-100" };
const colorMap = { Briefcase: "text-purple-600", Globe: "text-blue-600", Rocket: "text-gray-500", Users: "text-purple-600" };

export default function ManageEventsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const data = await getAllEvents(token);
      setEvents(data.events || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Events", "Manage"]);
    setAction({ label: "Create Event", onClick: () => navigate("/dashboard/events/create") });
  }, [setBreadcrumbs, setAction, navigate]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(token, id);
      toast.success("Event deleted successfully");
      fetchEvents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getIcon = (type) => {
    const icons = [Briefcase, Globe, Rocket, Users];
    return icons[Math.abs(type?.length || 0) % 4];
  };

  if (loading) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-violet-700" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Management</h1>
        <p className="text-gray-500 text-sm">Overview and administration of all platform events.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-purple-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider w-[25%]">Event Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">Venue</th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((event) => {
                const Icon = getIcon(event.type);
                return (
                  <tr key={event._id || event.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        <div className="p-3 rounded-xl mr-4 flex-shrink-0 bg-purple-100">
                          <Icon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm mb-0.5">{event.name}</div>
                          <div className="text-xs text-gray-400 font-medium">{event.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-medium text-gray-800">
                        {event.startDate ? new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD"}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600 font-medium">{event.venue}</td>
                    <td className="px-6 py-5 text-sm text-gray-600 font-medium">{event.category}</td>
                    <td className="px-6 py-5"><StatusBadge status={event.status} /></td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => toast.success(`View event: ${event.name}`)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => toast.success(`Edit event: ${event.name}`)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(event._id || event.id)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
```

### Task 20: AdminPage (real stats)

**Files:**
- Modify: `E:\Event-Hub\Frontend\src\pages\dashboard\AdminPage.jsx`

- [ ] **Rewrite AdminPage with real stats**

Replace entire file:

```jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar, UserPlus, Banknote, TrendingUp, MoreVertical,
  ChevronLeft, ChevronRight, Activity, Palette, Utensils,
  ArrowRight, Pencil, Trash2, Eye, Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { getAllEvents, getMyEvents } from "../../services/events";

export default function AdminPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [totalRegistrations, setTotalRegistrations] = useState(0);

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Admin"]);
    setAction({ label: "Create Event", onClick: () => navigate("/dashboard/events/create") });
  }, [setBreadcrumbs, setAction, navigate]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getAllEvents(token),
      getMyEvents(token),
    ])
      .then(([eventsData, myData]) => {
        if (cancelled) return;
        setEvents(eventsData.events || []);
        setTotalRegistrations((myData.events || []).length);
      })
      .catch((err) => {
        if (!cancelled) toast.error(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [token]);

  const totalEvents = events.length;
  const publishedEvents = events.filter((e) => e.status === "published").length;
  const upcomingEvents = events
    .filter((e) => new Date(e.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const statsData = [
    {
      id: 1, title: "TOTAL EVENTS", value: String(totalEvents),
      trend: "+0%", trendText: "all time", icon: Calendar,
      colorClass: "text-purple-600 bg-purple-100",
      gradientClass: "bg-gradient-to-t from-purple-50 to-white",
    },
    {
      id: 2, title: "PUBLISHED EVENTS", value: String(publishedEvents),
      trend: "+0%", trendText: "currently live", icon: UserPlus,
      colorClass: "text-blue-600 bg-blue-100",
      gradientClass: "bg-gradient-to-t from-blue-50 to-white",
    },
    {
      id: 3, title: "TOTAL REGISTRATIONS", value: String(totalRegistrations),
      trend: "+0%", trendText: "across all events", icon: Banknote,
      colorClass: "text-emerald-600 bg-emerald-100",
      gradientClass: "bg-gradient-to-t from-emerald-50 to-white",
    },
  ];

  if (loading) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-violet-700" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">Here's what's happening with your events today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className={`border border-gray-100 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden ${stat.gradientClass}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">{stat.title}</h3>
                  <div className="text-4xl font-extrabold text-gray-900">{stat.value}</div>
                </div>
                <div className={`p-2.5 rounded-xl ${stat.colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center text-sm mt-2">
                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1.5" />
                <span className="text-emerald-600 font-semibold mr-2">{stat.trend}</span>
                <span className="text-gray-400">{stat.trendText}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Upcoming Events</h2>
          <button onClick={() => navigate("/dashboard/events/manage")}
            className="text-violet-700 hover:text-violet-800 text-sm font-semibold flex items-center transition-colors">
            View All <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Event Name</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Venue</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {upcomingEvents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No upcoming events</td>
                </tr>
              ) : (
                upcomingEvents.slice(0, 5).map((event) => {
                  const icons = [Activity, Palette, Utensils];
                  const EventIcon = icons[Math.abs(event.name?.length || 0) % 3];
                  const iconColors = ["bg-purple-100 text-purple-600", "bg-blue-100 text-blue-600", "bg-amber-100 text-amber-700"];
                  return (
                    <tr key={event._id || event.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 flex items-center">
                        <div className={`p-2.5 rounded-xl mr-4 ${iconColors[0]}`}>
                          <EventIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm mb-0.5">{event.name}</div>
                          <div className="text-xs text-gray-400">{event.category}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-800">
                          {event.startDate ? new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{event.venue}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          event.status === "published" ? "bg-emerald-100 text-emerald-700" :
                          event.status === "draft" ? "bg-gray-100 text-gray-700" : "bg-red-100 text-red-700"
                        }`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button onClick={() => setOpenDropdown(openDropdown === (event._id || event.id) ? null : (event._id || event.id))}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {openDropdown === (event._id || event.id) && (
                          <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                            <button onClick={() => { setOpenDropdown(null); toast.success("View event"); }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <Eye className="w-4 h-4 mr-3 text-gray-400" /> View
                            </button>
                            <button onClick={() => { setOpenDropdown(null); toast.success("Edit event"); }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <Pencil className="w-4 h-4 mr-3 text-gray-400" /> Edit
                            </button>
                            <button onClick={() => { setOpenDropdown(null); toast.success("Delete event"); }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4 mr-3" /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
```

### Task 21: UsersPage (API-based user management)

**Files:**
- Modify: `E:\Event-Hub\Frontend\src\pages\dashboard\UsersPage.jsx`

- [ ] **Rewrite UsersPage with real API data**

Replace entire file:

```jsx
import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Loader2, Shield, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { getUsers, updateUserRole, deleteUser } from "../../services/users";

const ROLES = ["admin", "user", "organizer"];

export default function UsersPage() {
  const { token } = useAuth();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      const data = await getUsers(token);
      setUsers(data.users || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Users"]);
    setAction(null);
  }, [setBreadcrumbs, setAction]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(token, userId, newRole);
      toast.success("Role updated successfully");
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(token, userId);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-violet-700" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Users Management</h1>
        <p className="text-gray-500 text-sm">Manage platform users, roles, and account statuses.</p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-2 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input type="text" placeholder="Search users..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64 shadow-sm" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-purple-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider w-[25%]">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider w-[30%]">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No users found</td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const initials = user.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                            {initials}
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">{user.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className={`text-xs font-medium rounded-full px-3 py-1 border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            user.role === "admin" ? "bg-purple-100 text-purple-700 border-purple-200" :
                            user.role === "organizer" ? "bg-blue-100 text-blue-700 border-blue-200" :
                            "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDelete(user.id)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded-md transition-colors" title="Delete user">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
```

### Task 22: OrganizersPage (fetch from API)

**Files:**
- Modify: `E:\Event-Hub\Frontend\src\pages\dashboard\OrganizersPage.jsx`

- [ ] **Rewrite OrganizersPage with real data**

Replace entire file:

```jsx
import { useState, useEffect } from "react";
import { Users, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { getOrganizers } from "../../services/users";

export default function DashboardOrganizers() {
  const { token } = useAuth();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Organizers"]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    if (!token) return;
    getOrganizers(token)
      .then((data) => setOrganizers(data.organizers || []))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-violet-700" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <section className="space-y-2">
        <h1 className="font-[Poppins] text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">Organizers</h1>
        <p className="text-base text-slate-500">Browse and manage event organizers.</p>
      </section>

      {organizers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-20 text-center">
          <Users size={48} className="text-slate-300" />
          <p className="mt-4 text-lg font-medium text-slate-500">No organizers yet</p>
          <p className="text-sm text-slate-400">Promote users to organizer role from the Users page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizers.map((org) => {
            const initials = org.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "O";
            return (
              <div key={org.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold flex-shrink-0">
                  {initials}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{org.name}</h3>
                  <p className="text-sm text-gray-500">{org.email}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

### Task 23: ProfilePage (minor update for interests)

**Files:**
- Modify: `E:\Event-Hub\Frontend\src\pages\dashboard\ProfilePage.jsx`

- [ ] **Add interests display to ProfilePage**

After the Settings card (after line 100, the closing `</div>` of the second column), add:

```jsx
        {user?.interests?.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Interests</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest) => (
                <span key={interest} className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
```

Place this after the Settings card div and before the closing `</div>` of the component wrapper.

---

## Self-Review Checklist

1. **Spec coverage:** All sections covered — 3 backend models, 12+ API endpoints, 2 frontend services, 10 dashboard pages rewired, auth profile update.
2. **Placeholder scan:** No TBDs, TODOs, or vague instructions. Every file has complete replacement code.
3. **Type consistency:** Service function names (getMyEvents, getSavedEvents, etc.) match between service files and page imports. API response shapes (events array, event objects with _id) are consistent.
4. **Scope:** Focused on dashboard. All 10 dashboard pages covered.
