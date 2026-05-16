# API Security Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add refresh token mechanism, logout functionality, and password change to the existing auth API while using existing patterns

**Architecture:** Add JWT refresh tokens with HTTP-only cookies, implement logout to blacklist tokens, add password change endpoint - follow existing Express middleware pattern

**Tech Stack:** Express.js, JWT, bcryptjs (existing)

---

## File Structure

- Modify: `Backend/src/server.js` - add refresh token route mount
- Create: `Backend/src/routes/auth.js` - add new endpoints to existing routes
- Create: `Backend/src/routes/refresh.js` - new refresh token route
- Create: `Backend/src/controllers/refreshController.js` - refresh token logic
- Create: `Backend/src/controllers/authController.js` - extend with logout/password change
- Create: `Backend/src/middleware/authenticate.js` - existing, will verify token blacklist
- Create: `Backend/src/models/Token.js` - token blacklist model
- Modify: `Frontend/src/services/auth.js` - add new API calls

---

## Task 1: Create Token Blacklist Model

**Files:**
- Create: `Backend/src/models/Token.js`

- [ ] **Step 1: Create Token model for blacklist**

```javascript
import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["access", "refresh"],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Token", tokenSchema);
```

- [ ] **Step 2: Commit**

```bash
git add Backend/src/models/Token.js
git commit -m "feat: add Token model for token blacklist"
```

---

## Task 2: Extend Auth Controller with Logout and Password Change

**Files:**
- Modify: `Backend/src/controllers/authController.js` - append new functions

- [ ] **Step 1: Add logout function to authController.js**

Add after `updateProfile` function:

```javascript
export async function logout(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      await Token.create({
        token,
        type: "access",
        user: req.user._id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });
    }
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
```

- [ ] **Step 2: Add changePassword function to authController.js**

Add after `logout`:

```javascript
export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    await Token.deleteMany({ user: user._id, type: "refresh" });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
```

- [ ] **Step 3: Import Token model at top of file**

Change the import line from:
```javascript
import User from "../models/User.js";
```
to:
```javascript
import User from "../models/User.js";
import Token from "../models/Token.js";
```

- [ ] **Step 4: Commit**

```bash
git add Backend/src/controllers/authController.js
git commit -m "feat: add logout and changePassword endpoints"
```

---

## Task 3: Create Refresh Token Route

**Files:**
- Create: `Backend/src/controllers/refreshController.js`
- Create: `Backend/src/routes/refresh.js`

- [ ] **Step 1: Create refreshController.js**

```javascript
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Token from "../models/Token.js";
import generateToken from "../utils/generateToken.js";

export async function refreshAccess(req, res) {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const blacklisted = await Token.findOne({ token, type: "refresh" });
    if (blacklisted) {
      return res.status(401).json({ message: "Refresh token has been revoked" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
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
```

- [ ] **Step 2: Create refresh route**

Create `Backend/src/routes/refresh.js`:

```javascript
import { Router } from "express";
import { refreshAccess } from "../controllers/refreshController.js";

const router = Router();

router.post("/access", refreshAccess);

export default router;
```

- [ ] **Step 3: Commit**

```bash
git add Backend/src/controllers/refreshController.js Backend/src/routes/refresh.js
git commit -m "feat: add refresh token endpoint"
```

---

## Task 4: Update Auth Routes with New Endpoints

**Files:**
- Modify: `Backend/src/routes/auth.js` - add logout and changePassword

- [ ] **Step 1: Update auth routes**

Change line 2 from:
```javascript
import { register, login, getMe, updateProfile } from "../controllers/authController.js";
```
to:
```javascript
import { register, login, getMe, updateProfile, logout, changePassword } from "../controllers/authController.js";
```

Add after line 10:
```javascript
router.post("/logout", authenticate, logout);
router.put("/password", authenticate, changePassword);
```

- [ ] **Step 2: Commit**

```bash
git add Backend/src/routes/auth.js
git commit -m "feat: add logout and password change routes"
```

---

## Task 5: Update Server to Mount Refresh Route

**Files:**
- Modify: `Backend/src/server.js` - add refresh route, cookie parser

- [ ] **Step 1: Add cookie-parser and refresh route import**

Add after line 4 (imports):
```javascript
import cookieParser from "cookie-parser";
import refreshRoutes from "./routes/refresh.js";
```

Add after line 11 (middleware):
```javascript
app.use(cookieParser());
```

Add after line 14 (existing routes):
```javascript
app.use("/api/refresh", refreshRoutes);
```

- [ ] **Step 2: Commit**

```bash
git add Backend/src/server.js
git commit -m "feat: mount refresh token route"
```

---

## Task 6: Update Generate Token for Refresh Tokens

**Files:**
- Modify: `Backend/src/utils/generateToken.js` - add refresh token generation

- [ ] **Step 1: Update generateToken to support refresh tokens**

```javascript
import jwt from "jsonwebtoken";

export default function generateToken(userId, type = "access") {
  const secret = type === "refresh"
    ? process.env.JWT_REFRESH_SECRET
    : process.env.JWT_ACCESS_SECRET;

  const expiresIn = type === "refresh"
    ? process.env.JWT_REFRESH_EXPIRES || "7d"
    : process.env.JWT_ACCESS_EXPIRES || "15m";

  return jwt.sign({ userId }, secret, { expiresIn });
}
```

- [ ] **Step 2: Create helper for refresh token creation**

Add new function in `Backend/src/utils/generateToken.js`:

```javascript
export function generateRefreshToken(userId) {
  return generateToken(userId, "refresh");
}
```

- [ ] **Step 3: Commit**

```bash
git add Backend/src/utils/generateToken.js
git commit -m "feat: add refresh token generation"
```

---

## Task 7: Update Login to Return Refresh Token

**Files:**
- Modify: `Backend/src/controllers/authController.js` - login returns refresh token

- [ ] **Step 1: Update login to set refresh token cookie**

Add import at top:
```javascript
import { generateRefreshToken } from "../utils/generateToken.js";
```

Replace login function's token generation section (lines 39-44) with:

```javascript
const accessToken = generateToken(user._id);
const refreshToken = generateRefreshToken(user._id);

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

res.json({
  user: { id: user._id, name: user.name, email: user.email, role: user.role },
  accessToken,
});
```

- [ ] **Step 2: Commit**

```bash
git add Backend/src/controllers/authController.js
git commit -m "feat: set refresh token cookie on login"
```

---

## Task 8: Update Frontend Auth Service

**Files:**
- Modify: `Frontend/src/services/auth.js`

- [ ] **Step 1: Add logout function**

Add after getMe:

```javascript
export async function logout(token) {
  const res = await fetch(`${API_BASE}/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}
```

- [ ] **Step 2: Add changePassword function**

Add after logout:

```javascript
export async function changePassword(token, currentPassword, newPassword) {
  const res = await fetch(`${API_BASE}/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}
```

- [ ] **Step 3: Commit**

```bash
git add Frontend/src/services/auth.js
git commit -m "feat: add logout and changePassword to frontend"
```

---

## Task 9: Add Environment Variables

**Files:**
- Modify: `Backend/.env` (if exists) or create env example

- [ ] **Step 1: Document required env vars**

Add to `.env`:
```
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_REFRESH_EXPIRES=7d
```

- [ ] **Step 2: Commit**

```bash
git add Backend/.env
git commit -m "chore: add refresh token env vars"
```

---

## Task 10: Verify Everything Works

**Files:**
- Test all endpoints manually

- [ ] **Step 1: Test register endpoint**

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'
```

- [ ] **Step 2: Test login returns refresh token cookie**

Check response includes accessToken and Set-Cookie header

- [ ] **Step 3: Test /me with access token**

```bash
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer <access_token>"
```

- [ ] **Step 4: Test refresh endpoint**

```bash
curl -X POST http://localhost:4000/api/refresh/access \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<token_from_cookie>"}'
```

- [ ] **Step 5: Test logout**

```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -H "Authorization: Bearer <access_token>"
```

- [ ] **Step 6: Commit**

```bash
git commit -m "test: verify all new endpoints work"
```

---

## Plan Coverage Check

| Requirement | Task |
|-------------|------|
| Refresh token mechanism | Task 1, 3, 6, 7 |
| Logout endpoint | Task 2, 5, 8 |
| Password change | Task 2, 5, 8 |
| Token blacklist for logout | Task 1 |
| HTTP-only cookies for refresh | Task 7 |

---

**Plan complete and saved to `docs/superpowers/plans/2026-05-17-api-security-improvements.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**