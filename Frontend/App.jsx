import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import RootLayout from './src/layouts/RootLayout'
import ProtectedRoute from './src/components/auth/ProtectedRoute'
import DashboardLayout from './src/layouts/DashboardLayout'
import PageSkeleton from './src/components/ui/PageSkeleton'
import ErrorBoundary from './src/components/ui/ErrorBoundary'

const HomePage = lazy(() => import('./src/pages/HomePage'))
const EventsPage = lazy(() => import('./src/pages/EventsPage'))
const VenuesPage = lazy(() => import('./src/pages/VenuesPage'))
const ContactPage = lazy(() => import('./src/pages/ContactPage'))
const AuthPage = lazy(() => import('./src/pages/AuthPage'))
const UserDashboard = lazy(() => import('./src/pages/UserDashboard'))
const DashboardEvents = lazy(() => import('./src/pages/dashboard/EventsPage'))
const DashboardOrganizers = lazy(() => import('./src/pages/dashboard/OrganizersPage'))
const DashboardProfile = lazy(() => import('./src/pages/dashboard/ProfilePage'))
const AdminPage = lazy(() => import('./src/pages/dashboard/AdminPage'))
const MyEventsPage = lazy(() => import('./src/pages/dashboard/MyEventsPage'))
const SavedEventsPage = lazy(() => import('./src/pages/dashboard/SavedEventsPage'))
const ManageEventsPage = lazy(() => import('./src/pages/dashboard/ManageEventsPage'))
const CreateEventPage = lazy(() => import('./src/pages/dashboard/CreateEventPage'))
const UsersPage = lazy(() => import('./src/pages/dashboard/UsersPage'))
const ProfileSettingsPage = lazy(() => import('./src/pages/dashboard/ProfileSettingsPage'))

// Demo routes — START
const DemoAdminDashboard = lazy(() => import('./src/Dashboard Mockups/AdminDashboard'))
const DemoUserManagement = lazy(() => import('./src/Dashboard Mockups/UserManagement'))
const DemoEventManagement = lazy(() => import('./src/Dashboard Mockups/EventManagement'))
const DemoCreateEvent = lazy(() => import('./src/Dashboard Mockups/CreateEvent'))
const DemoMyEvents = lazy(() => import('./src/Dashboard Mockups/MyEvents'))
const DemoSavedEvents = lazy(() => import('./src/Dashboard Mockups/SavedEvents'))
const DemoProfileSettings = lazy(() => import('./src/Dashboard Mockups/ProfileSettings'))
// Demo routes — END

export default function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Suspense fallback={<PageSkeleton />}>
        <ErrorBoundary>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/venues" element={<VenuesPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          <Route path="/register" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />

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

          {/* Demo routes — START */}
          <Route path="/demo/admin-dashboard" element={<DemoAdminDashboard />} />
          <Route path="/demo/user-management" element={<DemoUserManagement />} />
          <Route path="/demo/event-management" element={<DemoEventManagement />} />
          <Route path="/demo/create-event" element={<DemoCreateEvent />} />
          <Route path="/demo/my-events" element={<DemoMyEvents />} />
          <Route path="/demo/saved-events" element={<DemoSavedEvents />} />
          <Route path="/demo/profile-settings" element={<DemoProfileSettings />} />
          {/* Demo routes — END */}
        </Routes>
        </ErrorBoundary>
      </Suspense>
    </>
  )
}
