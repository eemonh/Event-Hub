# Role-Based Dashboard Design

## Overview

Event-Hub needs a role-based dashboard with Admin and User roles. The system uses a real backend (Express + MongoDB + JWT) with role-based access control on both frontend and backend.

## Roles

- **Admin** — full access to admin dashboard, event management, user management, organizer management, and create events
- **User** — personal dashboard, browse all events, manage their own events (my events, saved events), profile/settings
- **Organizer** — managed by Admin, not a separate login role

## Backend Architecture

### Directory Structure

```
Backend/
├── src/
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── User.js
│   ├── controllers/
│   │   └── authController.js
│   ├── routes/
│   │   └── auth.js
│   ├── middleware/
│   │   ├── authenticate.js
│   │   └── authorize.js
│   └── utils/
├── package.json
└── .env
```

### User Model

```
User {
  name: String (required)
  email: String (required, unique, lowercase)
  password: String (required, bcrypt-hashed)
  role: String enum ['admin', 'user', 'organizer'] (default: 'user')
  avatar: String (URL, optional)
}, timestamps: true
```

### Auth Endpoints

| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| POST | `/api/auth/register` | Public | Creates user with role='user', returns JWT |
| POST | `/api/auth/login` | Public | Validates credentials, returns JWT with role |
| GET | `/api/auth/me` | Authenticated | Returns current user profile + role |
| PUT | `/api/auth/profile` | Authenticated | Update name/avatar/password |

### Middleware

- `authenticate` — verifies JWT from `Authorization: Bearer <token>`, attaches `req.user`
- `authorize('admin')` — checks `req.user.role` against allowed roles, returns 403 if not

## Frontend Changes

### AuthContext Upgrade

- Add `role` to context state (alongside `user`, `token`, `isAuthenticated`)
- After login/register, parse role from JWT payload
- `loginUser` / `registerUser` call real backend endpoints via `fetch`
- Store `token` in localStorage, use in `Authorization` header
- On app mount, call `GET /api/auth/me` to validate + get role

### Role-Based Sidebar (SideNavBar.jsx)

| Section | Admin | User |
|---------|-------|------|
| Dashboard | `/dashboard/admin` | `/dashboard` |
| All Events | ✅ | ✅ |
| My Events | ❌ | ✅ |
| Saved Events | ❌ | ✅ |
| Event Management | ✅ | ❌ |
| Users | ✅ | ❌ |
| Organizers | ✅ | ❌ |
| Profile | ✅ | ✅ |
| Settings | ✅ | ✅ |

### TopAppBar — Create Event Button

Only show when `user.role === 'admin'`.

### Route Protection (ProtectedRoute.jsx)

- Accept optional `allowedRoles` prop (e.g., `['admin']`)
- If user's role not in `allowedRoles`, redirect to their appropriate dashboard

### Updated Routes (App.jsx)

```
/dashboard              → any role     → UserDashboard
/dashboard/admin        → admin only   → AdminPage
/dashboard/events       → any role     → EventsPage
/dashboard/events/my    → user only    → MyEventsPage
/dashboard/events/saved → user only    → SavedEventsPage
/dashboard/events/manage→ admin only   → ManageEventsPage
/dashboard/events/create→ admin only   → CreateEventPage
/dashboard/users        → admin only   → UsersPage
/dashboard/organizers   → admin only   → OrganizersPage
/dashboard/profile      → any role     → ProfilePage
/dashboard/profile/settings → any role → ProfileSettingsPage
```

### Service Layer (services/auth.js)

Replace localStorage mock with real API calls to `http://localhost:5000/api/auth/*`.
