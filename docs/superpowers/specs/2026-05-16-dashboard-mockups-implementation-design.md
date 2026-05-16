# Dashboard Mockups Implementation Design

## Overview

Implement all 8 prototype components from `src/Dashboard Mockups/` as real, routed dashboard pages. Each mockup currently relies on a `MockupLayout` wrapper (its own sidebar + topbar) — we strip that wrapper and adapt the content to work with the project's existing `DashboardLayout` (which provides `SideNavBar` + `TopAppBar` via `<Outlet />`).

## Route Architecture

All existing pages at `/dashboard`, `/dashboard/events`, `/dashboard/organizers`, `/dashboard/profile` are kept as-is. Seven new routes are added:

| Route | Source Mockup | New File |
|-------|--------------|----------|
| `/dashboard/admin` | AdminDashboard | `src/pages/dashboard/AdminPage.jsx` |
| `/dashboard/events/create` | CreateEvent | `src/pages/dashboard/CreateEventPage.jsx` |
| `/dashboard/events/manage` | EventManagement | `src/pages/dashboard/ManageEventsPage.jsx` |
| `/dashboard/events/my` | MyEvents | `src/pages/dashboard/MyEventsPage.jsx` |
| `/dashboard/events/saved` | SavedEvents | `src/pages/dashboard/SavedEventsPage.jsx` |
| `/dashboard/users` | UserManagement | `src/pages/dashboard/UsersPage.jsx` |
| `/dashboard/profile/settings` | ProfileSettings | `src/pages/dashboard/ProfileSettingsPage.jsx` |

All new routes are wrapped inside `ProtectedRoute` + `DashboardLayout` in `App.jsx`.

## SideNavBar Structure

The sidebar gets section header labels to group items under categories. In expanded mode, the structure is:

```
OVERVIEW
  Dashboard       → /dashboard
  Admin Dashboard → /dashboard/admin

EVENTS
  All Events      → /dashboard/events
  My Events       → /dashboard/events/my
  Saved Events    → /dashboard/events/saved
  Create Event    → /dashboard/events/create
  Event Management→ /dashboard/events/manage

PEOPLE
  Users           → /dashboard/users
  Organizers      → /dashboard/organizers

ACCOUNT
  Profile         → /dashboard/profile
  Settings        → /dashboard/profile/settings
```

Section labels only show when sidebar is expanded (hidden in collapsed icon-only mode). Active route detection uses prefix matching for parent routes (e.g. `/dashboard/events` matches `/dashboard/events/create`).

## Adaptation Pattern

Each new page follows this structure:

```jsx
import { useEffect } from "react";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";

export default function NewPage() {
  const { setBreadcrumbs, setAction } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Section"]);
    setAction({ label: "Action", onClick: () => {} });
  }, [setBreadcrumbs, setAction]);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      {/* JSX extracted from mockup, minus MockupLayout */}
    </main>
  );
}
```

Key changes per mockup:
- **Remove** `import MockupLayout from './MockupLayout'`
- **Remove** the `<MockupLayout>` wrapper element
- **Replace** `font-sans` references with `font-[Inter]` convention already in use
- **Replace** `#6200ea` color code with `violet-700` Tailwind utility (project convention)
- **Remove** close/escape button from CreateEvent (it's a page, not a modal)
- **Adapt** breadcrumbs to use `useBreadcrumbs` instead of MockupLayout's breadcrumb prop
- **Keep** mock data as-is for now (API integration is a future step)

## Implementation Order

| Step | Task | Files |
|------|------|-------|
| 1 | Create `AdminPage.jsx` from AdminDashboard mockup | `src/pages/dashboard/AdminPage.jsx` |
| 2 | Create `MyEventsPage.jsx` from MyEvents mockup | `src/pages/dashboard/MyEventsPage.jsx` |
| 3 | Create `SavedEventsPage.jsx` from SavedEvents mockup | `src/pages/dashboard/SavedEventsPage.jsx` |
| 4 | Create `ManageEventsPage.jsx` from EventManagement mockup | `src/pages/dashboard/ManageEventsPage.jsx` |
| 5 | Create `CreateEventPage.jsx` from CreateEvent mockup | `src/pages/dashboard/CreateEventPage.jsx` |
| 6 | Create `UsersPage.jsx` from UserManagement mockup | `src/pages/dashboard/UsersPage.jsx` |
| 7 | Create `ProfileSettingsPage.jsx` from ProfileSettings mockup | `src/pages/dashboard/ProfileSettingsPage.jsx` |
| 8 | Refactor `SideNavBar.jsx` with section headers + new items | `src/layouts/SideNavBar.jsx` |
| 9 | Update `App.jsx` with 7 new lazy imports + routes | `App.jsx` |
| 10 | Verify: `npm run build` succeeds | — |

## Key Decisions

- Mockup pages are **new separate files**, not replacing existing placeholders
- `CreateEvent` is a **full page route**, not a modal
- AdminDashboard is a **separate admin route**, not replacing the user dashboard
- Sidebar has **visual section headers** for grouping (expanded mode only)
- Mock data stays in each component; no API integration yet
- Color tokens `#6200ea` are replaced with `violet-700` Tailwind class to match project conventions
