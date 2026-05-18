import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import RootLayout from './src/layouts/RootLayout'
import ProtectedRoute from './src/components/auth/ProtectedRoute'
import DashboardLayout from './src/layouts/DashboardLayout'
import PageSkeleton from './src/components/ui/PageSkeleton'
import ErrorBoundary from './src/components/ui/ErrorBoundary'
import { useAuth } from './src/context/AuthContext'

const HomePage = lazy(() => import('./src/pages/HomePage'))
const EventsPage = lazy(() => import('./src/pages/EventsPage'))
const EventDetailPage = lazy(() => import('./src/pages/EventDetailPage'))
const ContactPage = lazy(() => import('./src/pages/ContactPage'))
const AboutUs = lazy(() => import('./src/pages/AboutUs'))
const AuthPage = lazy(() => import('./src/pages/AuthPage'))
const UserDashboard = lazy(() => import('./src/pages/UserDashboard'))
const DashboardEvents = lazy(() => import('./src/pages/dashboard/EventsPage'))

const DashboardProfile = lazy(() => import('./src/pages/dashboard/ProfilePage'))
const AdminPage = lazy(() => import('./src/pages/dashboard/AdminPage'))
const MyEventsPage = lazy(() => import('./src/pages/dashboard/MyEventsPage'))
const SavedEventsPage = lazy(() => import('./src/pages/dashboard/SavedEventsPage'))
const ManageEventsPage = lazy(() => import('./src/pages/dashboard/ManageEventsPage'))
const CreateEventPage = lazy(() => import('./src/pages/dashboard/CreateEventPage'))
const UsersPage = lazy(() => import('./src/pages/dashboard/UsersPage'))
const ProfileSettingsPage = lazy(() => import('./src/pages/dashboard/ProfileSettingsPage'))
const TicketsPage = lazy(() => import('./src/pages/dashboard/TicketsPage'))
const PrototypeExploreEvents = lazy(() => import('./src/Prototype/ExploreEvents'))
const PrototypeEventPage = lazy(() => import('./src/Prototype/EventPage'))
const PrototypeEventDetailsPage = lazy(() => import('./src/Prototype/EventDetailsPage'))
function ConditionalDashboard() {
  const { user } = useAuth();
  return user?.role === "admin" ? <AdminPage /> : <UserDashboard />;
}

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
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          <Route path="/register" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/events/:eventId" element={<EventDetailPage />} />
          <Route path="/prototype/event" element={<PrototypeEventPage />} />
          <Route path="/prototype/event-details" element={<PrototypeEventDetailsPage />} />
          <Route path="/prototype/explore-events" element={<PrototypeExploreEvents />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<ConditionalDashboard />} />
              <Route path="/dashboard/events" element={<DashboardEvents />} />
              <Route path="/dashboard/profile" element={<DashboardProfile />} />
              <Route path="/dashboard/events/my" element={<MyEventsPage />} />
              <Route path="/dashboard/events/saved" element={<SavedEventsPage />} />
              <Route path="/dashboard/profile/settings" element={<ProfileSettingsPage />} />
              <Route path="/dashboard/tickets" element={<TicketsPage />} />

              <Route path="/dashboard/admin" element={<Navigate to="/dashboard" replace />} />

              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/dashboard/events/manage" element={<ManageEventsPage />} />
                <Route path="/dashboard/events/create" element={<CreateEventPage />} />
                <Route path="/dashboard/users" element={<UsersPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
        </ErrorBoundary>
      </Suspense>
    </>
  )
}
