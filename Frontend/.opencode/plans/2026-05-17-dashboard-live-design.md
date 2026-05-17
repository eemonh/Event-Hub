# Dashboard Live Design

## Overview

Transform the Event-Hub dashboard from static mockups into a fully functional, data-driven interface. This requires building missing backend models/routes and wiring all frontend dashboard pages to real APIs.

## Scope

**Focus:** User dashboard pages (overview, my events, saved events, profile, settings) + supporting admin pages (event management, user management, admin overview, create event).

**Backend:** Add Event, Registration, Bookmark models + routes. Update User model with `interests`. Add user admin routes.

## Backend Architecture

### New Models

#### Event
```
{
  name: String (required),
  description: String (required),
  type: String (required, freeform),
  startDate: Date (required),
  endDate: Date (required),
  startTime: String,
  endTime: String,
  venue: String (required),
  coverImage: String (URL),
  category: String (required, enum of predefined list),
  capacity: Number (min: 1),
  price: Number (default: 0, min: 0),
  status: String (enum: draft | published | cancelled, default: published),
  organizer: ObjectId ref User (required, set to admin user),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

Predefined categories:
`Technology`, `Design`, `Business`, `Startup`, `Music`, `Arts`, `Health`, `Sports`, `Education`, `Food & Drink`, `Networking`, `Other`

#### Registration
```
{
  user: ObjectId ref User (required),
  event: ObjectId ref Event (required),
  registeredAt: Date (default: now)
}
Compound unique index on {user, event}
```

#### Bookmark
```
{
  user: ObjectId ref User (required),
  event: ObjectId ref Event (required),
  savedAt: Date (default: now)
}
Compound unique index on {user, event}
```

#### User Update
Add field: `interests: [String]` (array of predefined category strings, default: [])

### New Routes

#### Events (`/api/events`)

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/api/events` | No | - | List published events (query: ?category=&search=&page=&limit=) |
| GET | `/api/events/:id` | No | - | Single event with registration/bookmark counts |
| GET | `/api/events/my` | Yes | user | User's registered events (upcoming + past) |
| GET | `/api/events/saved` | Yes | user | User's bookmarked events |
| GET | `/api/events/recommended` | Yes | user | Published events matching user's interests (excludes already registered/bookmarked) |
| POST | `/api/events` | Yes | admin | Create event |
| PUT | `/api/events/:id` | Yes | admin | Update event |
| DELETE | `/api/events/:id` | Yes | admin | Delete event (also deletes related registrations and bookmarks) |
| POST | `/api/events/:id/register` | Yes | user | Register for event (checks capacity, prevents duplicates) |
| DELETE | `/api/events/:id/register` | Yes | user | Cancel registration |
| POST | `/api/events/:id/bookmark` | Yes | user | Bookmark event (prevents duplicates) |
| DELETE | `/api/events/:id/bookmark` | Yes | user | Remove bookmark |

#### Users (`/api/users`)

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/api/users` | Yes | admin | List all users |
| GET | `/api/users/organizers` | Yes | admin | List users with role=organizer |
| PUT | `/api/users/:id/role` | Yes | admin | Change user role |
| DELETE | `/api/users/:id` | Yes | admin | Delete user |

#### Auth Update

Update `PUT /api/auth/profile` to also accept `interests: [String]` (updates user's interest categories).

### Backend File Changes

New files:
- `src/models/Event.js`
- `src/models/Registration.js`
- `src/models/Bookmark.js`
- `src/routes/events.js`
- `src/routes/users.js`
- `src/controllers/eventController.js`
- `src/controllers/userController.js`

Modified files:
- `src/models/User.js` — add `interests` field
- `src/controllers/authController.js` — update `updateProfile` to handle interests
- `src/server.js` — mount new routes

## Frontend Architecture

### New Service Files

#### `src/services/events.js`
- getEvents, getEvent, getMyEvents, getSavedEvents, getRecommended
- createEvent, updateEvent, deleteEvent
- registerForEvent, cancelRegistration
- bookmarkEvent, removeBookmark

#### `src/services/users.js`
- getUsers, getOrganizers, updateUserRole, deleteUser

### Page-by-Page Changes

#### UserDashboard (`/dashboard`)
- Replace hardcoded "Alex" with `user.name` from AuthContext
- Fetch stats (registered + saved counts) and upcoming events from `/api/events/my`
- Fetch recommended from `/api/events/recommended`
- Loading skeleton, error states

#### MyEventsPage (`/dashboard/events/my`)
- Fetch from `/api/events/my`
- Split upcoming/past by date
- Cancel registration with confirmation

#### SavedEventsPage (`/dashboard/events/saved`)
- Fetch from `/api/events/saved`
- Bookmark toggle (remove)

#### ProfilePage (`/dashboard/profile`)
- Already alive from AuthContext
- Add interests display

#### ProfileSettingsPage (`/dashboard/profile/settings`)
- Wire up name save (PUT /api/auth/profile)
- Wire up password change (PUT /api/auth/password)
- Add interests selector
- Replace hardcoded defaults with AuthContext data

#### EventsPage (`/dashboard/events`)
- Replace empty state with published events grid
- Register/bookmark buttons
- Search + category filter

#### AdminPage (`/dashboard/admin`)
- Real stats from API

#### ManageEventsPage (`/dashboard/events/manage`)
- Fetch all events from API
- Wire up delete with confirmation
- Wire up edit

#### CreateEventPage (`/dashboard/events/create`)
- Submit to POST /api/events
- Validation, category dropdown, price, status

#### UsersPage (`/dashboard/users`)
- Fetch from `/api/users`
- Wire up role change, delete

#### OrganizersPage (`/dashboard/organizers`)
- Fetch from `/api/users/organizers`

### Shared Patterns

All data-fetching pages: useState for data/loading/error → useEffect fetch with token → loading skeleton → error toast → empty state → data display.

### Implementation Order
1. Backend models (Event, Registration, Bookmark, User update)
2. Backend routes (events, users, auth profile, mount)
3. Test backend endpoints
4. Frontend service files
5. User pages: ProfileSettings → MyEvents → SavedEvents → UserDashboard → EventsPage
6. Admin pages: ManageEvents → CreateEvent → UsersPage → AdminPage → OrganizersPage
