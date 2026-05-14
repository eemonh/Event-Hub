// UserDashboard.jsx

import {
  LayoutDashboard,
  CalendarDays,
  Bookmark,
  LogOut,
  Ticket,
  MapPin,
  Clock3,
  Calendar,
} from "lucide-react";

const stats = [
  {
    title: "Total Registered Events",
    value: "14",
    icon: Ticket,
  },
  {
    title: "Saved Events",
    value: "6",
    icon: Bookmark,
  },
];

const upcomingEvents = [
  {
    date: "Oct 24",
    title: "Tech Innovators Summit 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Moscone Center, SF",
  },
  {
    date: "Nov 02",
    title: "Design Leadership Conference",
    time: "10:00 AM - 4:00 PM",
    location: "Online Event",
  },
];

const recommendations = [
  {
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
    tag: "UX/UI",
    title: "Future of Web Design Workshop",
    date: "Nov 15, 2024",
    location: "Seattle, WA",
  },
  {
    image:
      "https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1200&auto=format&fit=crop",
    tag: "Leadership",
    title: "Product Managers Networking Night",
    date: "Dec 05, 2024",
    location: "The Grand Hotel, NY",
  },
  {
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    tag: "Startup",
    title: "Founder’s Pitch & Mingle",
    date: "Jan 12, 2025",
    location: "Innovation Hub, Austin",
  },
];

function SideNavbar() {
  return (
    <aside className="w-[232px] border-r border-slate-200 bg-white flex flex-col justify-between p-3">
      <div>
        <div className="px-3 py-2">
          <h1 className="text-[32px] leading-[38px] font-bold text-[#630ED4]">
            EventHub
          </h1>
        </div>

        <nav className="mt-6 flex flex-col gap-2">
          <NavItem icon={LayoutDashboard} label="Dashboard" />

          <NavItem icon={CalendarDays} label="My Events" />

          <NavItem
            icon={Bookmark}
            label="Saved Events"
            active
          />
        </nav>
      </div>

      <button className="flex items-center justify-center gap-2 rounded-lg bg-[#BA1A1A] py-3 text-white font-semibold hover:opacity-95 transition">
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}

function NavItem({ icon: Icon, label, active = false }) {
  return (
    <button
      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition
      ${
        active
          ? "bg-[#EDE5F4] text-[#630ED4]"
          : "text-[#4A4455] hover:bg-slate-100"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}

function TopHeader() {
  return (
    <header className="h-[73px] border-b border-slate-200 bg-white px-6 flex items-center justify-between shadow-sm">
      <p className="text-sm text-slate-500">Dashboard</p>

      <img
        src="https://i.pravatar.cc/100"
        alt="avatar"
        className="h-10 w-10 rounded-full border-2 border-slate-200 object-cover"
      />
    </header>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDE5F4]">
        <Icon size={20} className="text-[#630ED4]" />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </p>

        <h3 className="mt-1 text-[32px] leading-none font-bold text-slate-900">
          {value}
        </h3>
      </div>
    </div>
  );
}

function UpcomingEventCard({ event }) {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-4">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-[#EDE5F4] text-[#630ED4]">
          <span className="text-[10px] font-semibold uppercase">
            {event.date.split(" ")[0]}
          </span>

          <span className="text-lg font-bold leading-none">
            {event.date.split(" ")[1]}
          </span>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-slate-900">
            {event.title}
          </h4>

          <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Clock3 size={14} />
              {event.time}
            </span>

            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {event.location}
            </span>
          </div>
        </div>
      </div>

      <button className="flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
        <Ticket size={14} />
        View Ticket
      </button>
    </div>
  );
}

function RecommendationCard({ item }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="relative">
        <img
          src={item.image}
          alt={item.title}
          className="h-48 w-full object-cover"
        />

        <span className="absolute bottom-3 left-3 rounded bg-white px-2 py-1 text-xs font-semibold text-[#630ED4]">
          {item.tag}
        </span>

        <button className="absolute right-3 top-3 rounded-full bg-white/90 p-2">
          <Bookmark size={14} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-[24px] leading-tight font-semibold text-slate-900">
          {item.title}
        </h3>

        <div className="mt-4 space-y-2 text-sm text-slate-500">
          <p className="flex items-center gap-2">
            <Calendar size={14} />
            {item.date}
          </p>

          <p className="flex items-center gap-2">
            <MapPin size={14} />
            {item.location}
          </p>
        </div>

        <button className="mt-5 w-full rounded-lg bg-[#630ED4] py-3 text-sm font-semibold text-white hover:opacity-95">
          Register Now
        </button>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <div className="flex">
        <SideNavbar />

        <main className="flex-1">
          <TopHeader />

          <div className="p-8">
            {/* Welcome */}
            <section>
              <h1 className="text-5xl font-bold tracking-tight text-slate-900">
                Welcome back, Alex!
              </h1>

              <p className="mt-3 text-slate-500">
                You have{" "}
                <span className="font-medium text-[#630ED4]">
                  2 upcoming events
                </span>{" "}
                this month. Get ready to connect and learn.
              </p>
            </section>

            {/* Stats */}
            <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 max-w-2xl">
              {stats.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </section>

            {/* Upcoming Events */}
            <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <h2 className="text-[36px] font-bold text-slate-900">
                  Your Upcoming Events
                </h2>

                <button className="text-sm font-semibold text-[#630ED4]">
                  View All →
                </button>
              </div>

              {upcomingEvents.map((event) => (
                <UpcomingEventCard
                  key={event.title}
                  event={event}
                />
              ))}
            </section>

            {/* Recommended */}
            <section className="mt-10">
              <h2 className="text-4xl font-bold text-slate-900">
                Recommended for You
              </h2>

              <p className="mt-2 text-slate-500">
                Based on your interests in Technology and Design.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {recommendations.map((item) => (
                  <RecommendationCard
                    key={item.title}
                    item={item}
                  />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}