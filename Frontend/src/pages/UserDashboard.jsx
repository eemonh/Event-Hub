import {
  CalendarDays,
  Clock3,
  MapPin,
  Bookmark,
  Ticket,
  ChevronRight,
} from "lucide-react";

const stats = [
  {
    title: "Total Registered Events",
    value: "14",
    icon: <Ticket size={18} className="text-violet-700" />,
  },
  {
    title: "Saved Events",
    value: "6",
    icon: <Bookmark size={18} className="text-violet-700" />,
  },
];

const upcomingEvents = [
  {
    month: "Jun",
    day: "12",
    title: "Tech Innovators Summit 2026",
    time: "9:00 AM - 5:00 PM",
    location: "Moscone Center, SF",
  },
  {
    month: "Jul",
    day: "08",
    title: "Design Leadership Conference",
    time: "10:00 AM - 4:00 PM",
    location: "Online Event",
  },
];

const recommendedEvents = [
  {
    title: "Future of Web Design Workshop",
    tag: "UX/UI",
    date: "Jun 15, 2026",
    location: "Seattle, WA",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Product Managers Networking Night",
    tag: "Leadership",
    date: "Jul 05, 2026",
    location: "The Grand Hotel, NY",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Founder's Pitch & Mingle",
    tag: "Startup",
    date: "Aug 12, 2026",
    location: "Innovation Hub, Austin",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function UserDashboard() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        {/* HERO */}
        <section className="space-y-2">
          <h1 className="font-[Poppins] text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Welcome back, Alex!
          </h1>

          <p className="text-base text-slate-500">
            You have{" "}
            <span className="font-medium text-violet-700">
              2 upcoming events
            </span>{" "}
            this month. Get ready to connect and learn.
          </p>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:max-w-2xl">
          {stats.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
                {item.icon}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {item.title}
                </p>

                <h3 className="font-[Poppins] text-4xl font-bold text-slate-900">
                  {item.value}
                </h3>
              </div>
            </div>
          ))}
        </section>

        {/* UPCOMING EVENTS */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-6 py-5">
            <h2 className="font-[Poppins] text-3xl font-semibold">
              Your Upcoming Events
            </h2>

            <button className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-violet-700">
              View All
              <ChevronRight size={14} />
            </button>
          </div>

          <div>
            {upcomingEvents.map((event, index) => (
              <div
                key={event.title}
                className={`flex flex-col gap-5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between ${index !== upcomingEvents.length - 1
                    ? "border-b border-slate-100"
                    : ""
                  }`}
              >
                <div className="flex items-start gap-4">
                  {/* DATE BOX */}
                  <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg bg-violet-100">
                    <span className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                      {event.month}
                    </span>

                    <span className="font-[Poppins] text-xl font-semibold text-violet-700">
                      {event.day}
                    </span>
                  </div>

                  {/* EVENT INFO */}
                  <div className="space-y-1">
                    <h3 className="text-2xl font-semibold text-slate-900">
                      {event.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
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

                {/* BUTTON */}
                <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                  <Ticket size={15} />
                  View Ticket
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* RECOMMENDED */}
        <section className="space-y-2">
          <div>
            <h2 className="font-[Poppins] text-4xl font-semibold text-slate-900">
              Recommended for You
            </h2>

            <p className="mt-1 text-slate-500">
              Based on your interests in Technology and Design.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recommendedEvents.map((event) => (
              <div
                key={event.title}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* IMAGE */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute left-3 top-3 rounded-md bg-white px-2 py-1 text-xs font-semibold text-violet-700 shadow">
                    {event.tag}
                  </div>

                  <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow">
                    <Bookmark size={16} className="text-slate-500" />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="space-y-4 p-4">
                  <div>
                    <h3 className="font-[Poppins] text-2xl font-semibold leading-snug text-slate-900">
                      {event.title}
                    </h3>
                  </div>

                  <div className="space-y-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={14} />
                      {event.date}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      {event.location}
                    </div>
                  </div>

                  <button className="w-full rounded-xl bg-violet-700 py-3 text-sm font-semibold text-white transition hover:bg-violet-800">
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
    </main>
  );
}