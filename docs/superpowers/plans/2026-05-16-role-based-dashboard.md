# Role-Based Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real backend auth system (Express + MongoDB + JWT) and upgrade the frontend to support admin/user role-based access.

**Architecture:** Backend uses Express with MVC pattern (controllers/routes/models/middleware). Frontend connects via fetch API with JWT in Authorization header. Role is embedded in JWT and stored in AuthContext. SideNavBar and ProtectedRoute filter by role.

**Tech Stack:** Express 5, Mongoose 9, bcryptjs, jsonwebtoken, React 19, React Router DOM 7, Vite 8

---

### Task 1: Backend — Database Config

**Files:**
- Create: `Backend/src/config/db.js`

- [ ] **Step 1: Create db.js**

```js
import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add Backend/src/config/db.js
git commit -m "feat(backend): add database config"
```

---

### Task 2: Backend — User Model

**Files:**
- Create: `Backend/src/models/User.js`

- [ ] **Step 1: Create User.js**

```js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user", "organizer"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", userSchema);
```

- [ ] **Step 2: Commit**

```bash
git add Backend/src/models/User.js
git commit -m "feat(backend): add User model with role and password hashing"
```

---

### Task 3: Backend — Auth Middleware

**Files:**
- Create: `Backend/src/middleware/authenticate.js`
- Create: `Backend/src/middleware/authorize.js`

- [ ] **Step 1: Create authenticate.js**

```js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
```

- [ ] **Step 2: Create authorize.js**

```js
export default function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add Backend/src/middleware/authenticate.js Backend/src/middleware/authorize.js
git commit -m "feat(backend): add auth middleware (JWT verify + role authorization)"
```

---

### Task 4: Backend — Auth Controller

**Files:**
- Create: `Backend/src/controllers/authController.js`
- Create: `Backend/src/utils/generateToken.js`

- [ ] **Step 1: Create generateToken.js**

```js
import jwt from "jsonwebtoken";

export default function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
  });
}
```

- [ ] **Step 2: Create authController.js**

```js
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password, role: "user" });
    const token = generateToken(user._id);

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getMe(req, res) {
  try {
    const user = req.user;
    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const { name, avatar } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add Backend/src/controllers/authController.js Backend/src/utils/generateToken.js
git commit -m "feat(backend): add auth controller (register, login, getMe, updateProfile)"
```

---

### Task 5: Backend — Auth Routes

**Files:**
- Create: `Backend/src/routes/auth.js`

- [ ] **Step 1: Create auth.js**

```js
import { Router } from "express";
import { register, login, getMe, updateProfile } from "../controllers/authController.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.put("/profile", authenticate, updateProfile);

export default router;
```

- [ ] **Step 2: Commit**

```bash
git add Backend/src/routes/auth.js
git commit -m "feat(backend): add auth routes"
```

---

### Task 6: Backend — Server Entry Point

**Files:**
- Create: `Backend/src/server.js`

- [ ] **Step 1: Create server.js**

```js
import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
```

- [ ] **Step 2: Update Backend/package.json with type:module and start script**

Edit `Backend/package.json`:

```json
{
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js"
  },
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.5",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "mongodb": "^7.2.0",
    "mongoose": "^9.6.2"
  }
}
```

- [ ] **Step 3: Install cors dependency**

Run: `cd Backend && npm install`
Expected: cors package installed

- [ ] **Step 4: Test the server starts**

Run: `cd Backend && node src/server.js`
Expected: "MongoDB connected" + "Server running on port 4000"

- [ ] **Step 5: Commit**

```bash
git add Backend/src/server.js Backend/package.json
git commit -m "feat(backend): add Express server with CORS and auth routes"
```

---

### Task 7: Frontend — Vite Proxy Config

**Files:**
- Modify: `Frontend/vite.config.js`

- [ ] **Step 1: Add proxy for /api**

Edit `Frontend/vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
```

- [ ] **Step 2: Commit**

```bash
git add Frontend/vite.config.js
git commit -m "feat(frontend): add Vite proxy for /api to backend"
```

---

### Task 8: Frontend — Auth Service (Real API)

**Files:**
- Modify: `Frontend/src/services/auth.js`

- [ ] **Step 1: Replace mock with real API calls**

Edit `Frontend/src/services/auth.js`:

```js
const API_BASE = "/api/auth";

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function registerUser(name, email, password) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function getMe(token) {
  const res = await fetch(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}
```

- [ ] **Step 2: Commit**

```bash
git add Frontend/src/services/auth.js
git commit -m "feat(frontend): replace mock auth with real backend API calls"
```

---

### Task 9: Frontend — AuthContext Upgrade (Add Role)

**Files:**
- Modify: `Frontend/src/context/AuthContext.jsx`

- [ ] **Step 1: Upgrade AuthContext to support role + token validation on mount**

Edit `Frontend/src/context/AuthContext.jsx`:

```js
/* eslint-disable react-refresh/only-export-components */
import { useState, useCallback, createContext, useContext, useEffect } from "react";
import { loginUser, registerUser, getMe } from "../services/auth";

const AUTH_KEY = "eventhub_auth";
const AuthContext = createContext(null);

function loadAuth() {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.user && parsed.token) {
        return parsed;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function saveAuth(data) {
  if (data) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => {
    const saved = loadAuth();
    return {
      user: saved?.user ?? null,
      token: saved?.token ?? null,
    };
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (state.token) {
      getMe(state.token)
        .then((data) => {
          setState((prev) => ({ ...prev, user: data.user }));
        })
        .catch(() => {
          setState({ user: null, token: null });
          saveAuth(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await loginUser(email, password);
    setState({ user: result.user, token: result.token });
    saveAuth(result);
  }, []);

  const register = useCallback(async (name, email, password) => {
    const result = await registerUser(name, email, password);
    setState({ user: result.user, token: result.token });
    saveAuth(result);
  }, []);

  const logout = useCallback(() => {
    setState({ user: null, token: null });
    saveAuth(null);
  }, []);

  const isAuthenticated = state.user !== null && state.token !== null;

  return (
    <AuthContext.Provider value={{ user: state.user, token: state.token, isLoading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
```

- [ ] **Step 2: Commit**

```bash
git add Frontend/src/context/AuthContext.jsx
git commit -m "feat(frontend): add role to AuthContext with token validation on mount"
```

---

### Task 10: Frontend — ProtectedRoute with Role Checking

**Files:**
- Modify: `Frontend/src/components/auth/ProtectedRoute.jsx`

- [ ] **Step 1: Add allowedRoles prop and redirect logic**

Edit `Frontend/src/components/auth/ProtectedRoute.jsx`:

```js
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageSkeleton from "../ui/PageSkeleton";

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const redirectTo = user.role === "admin" ? "/dashboard/admin" : "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
```

- [ ] **Step 2: Commit**

```bash
git add Frontend/src/components/auth/ProtectedRoute.jsx
git commit -m "feat(frontend): add role-based access control to ProtectedRoute"
```

---

### Task 11: Frontend — Role-Based Sidebar

**Files:**
- Modify: `Frontend/src/layouts/SideNavBar.jsx`

- [ ] **Step 1: Filter sidebar sections by user role**

Edit `Frontend/src/layouts/SideNavBar.jsx`. Within the component, add role-based filtering:

```js
const { user, logout } = useAuth();
const isAdmin = user?.role === "admin";
```

Replace the hardcoded `sections` array with a computed one:

```js
const sections = [
  {
    label: "OVERVIEW",
    items: isAdmin
      ? [
          { name: "Admin Dashboard", path: "/dashboard/admin", icon: Shield },
        ]
      : [
          { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        ],
  },
  {
    label: "EVENTS",
    items: [
      { name: "All Events", path: "/dashboard/events", icon: CalendarDays },
      ...(isAdmin
        ? []
        : [
            { name: "My Events", path: "/dashboard/events/my", icon: CalendarCheck },
            { name: "Saved Events", path: "/dashboard/events/saved", icon: Bookmark },
          ]),
      ...(isAdmin
        ? [
            { name: "Create Event", path: "/dashboard/events/create", icon: PlusCircle },
            { name: "Event Management", path: "/dashboard/events/manage", icon: ListTodo },
          ]
        : []),
    ],
  },
  ...(isAdmin
    ? [
        {
          label: "PEOPLE",
          items: [
            { name: "Users", path: "/dashboard/users", icon: Users },
            { name: "Organizers", path: "/dashboard/organizers", icon: UserCog },
          ],
        },
      ]
    : []),
  {
    label: "ACCOUNT",
    items: [
      { name: "Profile", path: "/dashboard/profile", icon: User },
      { name: "Settings", path: "/dashboard/profile/settings", icon: Settings },
    ],
  },
];
```

Remove the `LayoutDashboard` import if no longer used directly in the static array (keep it for the dynamic mapping above).

The full imports should be:

```js
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Briefcase,
    LayoutDashboard,
    CalendarDays,
    Shield,
    Users,
    UserCog,
    User,
    CalendarCheck,
    Bookmark,
    PlusCircle,
    ListTodo,
    Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
```

- [ ] **Step 2: Commit**

```bash
git add Frontend/src/layouts/SideNavBar.jsx
git commit -m "feat(frontend): filter sidebar navigation by user role"
```

---

### Task 12: Frontend — TopAppBar Conditional Create Event Button

**Files:**
- Modify: `Frontend/src/layouts/TopAppBar.jsx`

- [ ] **Step 1: Only show action button for admin role**

Edit `Frontend/src/layouts/TopAppBar.jsx`:

```js
import { useAuth } from "../context/AuthContext";

const TopAppBar = ({ breadcrumbs = [], actionLabel = '', onAction }) => {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const userName = user?.name || "User";
    const userInitials = user?.name 
        ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";
    
    return (
        <header className="...">
            <nav className="..." aria-label="Breadcrumb">
                ...
            </nav>

            <div className="flex flex-row items-center gap-4">

                {isAdmin && actionLabel && onAction && (
                    <button type="button" onClick={onAction} className="...">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>{actionLabel}</span>
                    </button>
                )}

                <button type="button" className="...">
                    ...
                </button>

            </div>
        </header>
    );
};
```

Only change: wrap the action button render in `{isAdmin && ...}` instead of just `{actionLabel && onAction &&`.

Change line 30:
```
{actionLabel && onAction && (
```
to:
```
{isAdmin && actionLabel && onAction && (
```

- [ ] **Step 2: Commit**

```bash
git add Frontend/src/layouts/TopAppBar.jsx
git commit -m "feat(frontend): restrict TopAppBar action button to admin role"
```

---

### Task 13: Frontend — Route Protection in App.jsx

**Files:**
- Modify: `Frontend/App.jsx`

- [ ] **Step 1: Apply role-based ProtectedRoute wrappers for admin-only routes**

Edit the dashboard routes section in `Frontend/App.jsx`:

```jsx
<Route element={<ProtectedRoute />}>
  <Route element={<DashboardLayout />}>
    <Route path="/dashboard" element={<UserDashboard />} />
    <Route path="/dashboard/events" element={<DashboardEvents />} />
    <Route path="/dashboard/profile" element={<DashboardProfile />} />
    <Route path="/dashboard/events/my" element={<MyEventsPage />} />
    <Route path="/dashboard/events/saved" element={<SavedEventsPage />} />
    <Route path="/dashboard/profile/settings" element={<ProfileSettingsPage />} />

    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
      <Route path="/dashboard/admin" element={<AdminPage />} />
      <Route path="/dashboard/events/manage" element={<ManageEventsPage />} />
      <Route path="/dashboard/events/create" element={<CreateEventPage />} />
      <Route path="/dashboard/users" element={<UsersPage />} />
      <Route path="/dashboard/organizers" element={<DashboardOrganizers />} />
    </Route>
  </Route>
</Route>
```

- [ ] **Step 2: Commit**

```bash
git add Frontend/App.jsx
git commit -m "feat(frontend): apply role-based route protection in App.jsx"
```
