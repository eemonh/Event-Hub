// ─── Shared frontend types ────────────────────────────────────────────────────

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar?: string;
  interests?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  _id: string;
  id?: string;
  name: string;
  title?: string;
  description: string;
  subtitle?: string;
  schedule?: ScheduleItem[];
  type?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  venue: string;
  coverImage?: string;
  category?: string;
  date?: string;
  location?: string;
  image?: string;
  capacity?: number;
  price?: number;
  status?: "draft" | "published" | "cancelled" | "upcoming" | "ongoing" | "completed";
  organizer?: string | User;
  registrationCount?: number;
  upvoteCount?: number;
  bookmarkCount?: number;
  commentCount?: number;
  isRegistered?: boolean;
  isBookmarked?: boolean;
  isUpvoted?: boolean;
  userUpvoted?: boolean;
  keywords?: string[];
  reason?: string;
  registeredAt?: string;
  registrationId?: string;
  savedAt?: string;
  bookmarkId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScheduleItem {
  day: string;
  time: string;
  title: string;
  description: string;
}

export interface Comment {
  _id: string;
  id?: string;
  text: string;
  user: User | string;
  event: string;
  createdAt?: string;
}

export type Breadcrumb =
  | string
  | {
      label: string;
      href?: string;
    };

export type BreadcrumbAction = {
  label: string;
  onClick: () => void;
} | null;

// Auth
export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// API responses
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pages: number;
  total: number;
}

export interface EventsResponse {
  events: Event[];
  page: number;
  pages: number;
  total: number;
}

export interface EventResponse {
  event: Event;
}

export interface CommentsResponse {
  comments: Comment[];
  page?: number;
  pages?: number;
  total?: number;
}

export interface UsersResponse {
  users: User[];
}

// Analytics
export interface AnalyticsOverview {
  totalEvents: number;
  totalUsers: number;
  totalRegistrations: number;
  upcomingEvents: number;
  publishedEvents?: number;
  draftEvents?: number;
  cancelledEvents?: number;
  registrationGrowth?: number;
  eventGrowth?: number;
  userGrowth?: number;
  revenue?: number;
  revenueGrowth?: number;
}

export interface RegistrationTrend {
  date: string;
  count: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
}

export interface CategoryBreakdownResponse {
  byCategory: CategoryBreakdown[];
  byStatus: { status: string; count: number }[];
}

export interface EventPerformance {
  _id: string;
  id?: string;
  name: string;
  title?: string;
  startDate?: string;
  capacity?: number;
  registrationCount?: number;
  registrations: number;
  upvotes: number;
  bookmarks: number;
}

export interface EventPerformanceResponse {
  events: EventPerformance[];
  page: number;
  pages: number;
  total: number;
}

export interface UserGrowth {
  date: string;
  count: number;
}

export interface TopEvent {
  _id: string;
  id?: string;
  name: string;
  title?: string;
  startDate?: string;
  capacity?: number;
  registrationCount?: number;
  registrations: number;
  upvotes: number;
  fillRate?: number;
  bookmarkCount?: number;
}

// Event filters
export interface EventFilters {
  category?: string;
  search?: string;
  sort?: string;
  dateFilter?: string;
  page?: number;
  limit?: number;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface EventFormData {
  name: string;
  type: string;
  description: string;
  subtitle?: string;
  schedule?: ScheduleItem[];
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  venue: string;
  coverImage?: string;
  category?: string;
  capacity?: number;
  price?: number;
  status?: "draft" | "published" | "cancelled";
  title?: string;
  date?: string;
  location?: string;
  image?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface CreateUserFormData {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}
