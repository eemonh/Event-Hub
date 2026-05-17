# SideNavBar & TopAppBar Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle SideNavBar and TopAppBar to match the Dashboard Mockups design (purple theme, 256px collapsible sidebar, dynamic breadcrumbs, merged nav items).

**Architecture:** Modify 2 existing layout components + the DashboardLayout wrapper, then update page components to pass new props.

**Tech Stack:** React, Tailwind CSS, react-router-dom

---

### Task 1: SideNavBar — Width, Colors, Logout Button

**Files:**
- Modify: `E:\Event-Hub\Frontend\src\layouts\SideNavBar.jsx`

Changes:
- Expanded width: change from `w-60` (232px expanded / 64px collapsed) to `w-64` (256px)
- Primary color: `#6366F1` → `#6200ea` (including logo text, collapsed badge, active state)
- Active item bg (expanded): `bg-slate-100` → `bg-[#f3e5f5]`
- Active item text (expanded): `text-[#4A4455]` → `text-[#6200ea]`
- Active item (collapsed): ring `#6366F1` → ring `#6200ea`
- Logout button: `bg-[#BA1A1A]` → `bg-[#d32f2f]`
- Logo/badge: indigo `#6366F1` → purple `#6200ea`

### Task 2: SideNavBar — Add "Users" Nav Item

**Files:**
- Modify: `E:\Event-Hub\Frontend\src\layouts\SideNavBar.jsx`

Add a new Users nav item between Events and Organizers:
- Icon: Users/people SVG icon
- Path: `/dashboard/users`
- Label: "Users"
- Follow same pattern as existing nav items (active state, collapsed state, etc.)

### Task 3: TopAppBar — Height, Colors, Dynamic Props

**Files:**
- Modify: `E:\Event-Hub\Frontend\src\layouts\TopAppBar.jsx`

Changes:
- Height: `h-[73px]` → `h-16` (64px)
- Create/action button: `bg-[#15803D]` → `bg-[#6200ea]`
- Remove `breadcrumbMap` static route table
- Accept `breadcrumbs` prop: `string[]`, render with `ChevronRight` separators
- Accept `actionLabel` prop (default `"Create Event"`) and `onAction` prop (default navigates to `/dashboard/events`)
- Remove `useLocation`-based breadcrumb derivation logic

### Task 4: Update DashboardLayout & Page Components

**Files:**
- Find and modify the Dashboard layout wrapper (likely `src/layouts/DashboardLayout.jsx` or equivalent)
- Update all dashboard page components that use the layout

Each page passes breadcrumbs:
- AdminDashboard → `breadcrumbs={['Dashboard', 'Overview']}`
- EventManagement → `breadcrumbs={['Dashboard', 'Event Management']}`
- UserManagement → `breadcrumbs={['Dashboard', 'User Management']}`
- SavedEvents → `breadcrumbs={['Dashboard', 'Saved Events']}`
- MyEvents → `breadcrumbs={['Dashboard', 'My Events']}`
- CreateEvent → `breadcrumbs={['Dashboard', 'Events', 'Create']}`
- ProfileSettings → `breadcrumbs={['Dashboard', 'Profile']}`

Each page also passes appropriate `actionLabel` and `onAction`:
- Most pages: `actionLabel="Create Event"` + navigate to create event page
- DashboardLayout: add `bg-[#f8fafc]` to main content area
