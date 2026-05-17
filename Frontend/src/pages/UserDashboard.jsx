import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays, Clock3, MapPin, Bookmark, Ticket, ChevronRight, Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { getMyEvents, getRecommendedEvents } from "../services/events";

export default function UserDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();
  const [myEvents, setMyEvents] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Overview"]);
    setAction({ label: "Create Event", onClick: () => navigate("/dashboard/events/create") });
  }, [setBreadcrumbs, setAction, navigate]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    Promise.all([
      getMyEvents(token),
      getRecommendedEvents(token),
    ])
      .then(([myData, recData]) => {
        if (cancelled) return;
        setMyEvents(myData.events || []);
        setRecommended(recData.events || []);
      })
      .catch((err) => {
        if (!cancelled) toast.error(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [token]);

  const now = new Date();
  const upcomingEvents = myEvents
    .filter((e) => new Date(e.startDate) >= now)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const thisMonthCount = upcomingEvents.filter((e) => {
    const d = new Date(e.startDate);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  if (loading) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-violet-700" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <section className="space-y-2">
        <h1 className="font-[Poppins] text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Welcome back, {user?.name?.split(" ")[0] || "there"}!
        </h1>
        <p className="text-base text-slate-500">
          You have{" "}
          <span className="font-medium text-violet-700">
            {thisMonthCount} upcoming {thisMonthCount === 1 ? "event" : "events"}
          </span>{" "}
          this month. Get ready to connect and learn.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:max-w-2xl">
        <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
            <Ticket size={18} className="text-violet-700" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Registered Events</p>
            <h3 className="font-[Poppins] text-4xl font-bold text-slate-900">{myEvents.length}</h3>
          </div>
        </div>
        <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
            <Bookmark size={18} className="text-violet-700" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Saved Events</p>
            <h3 className="font-[Poppins] text-4xl font-bold text-slate-900">{recommended.length}</h3>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-6 py-5">
          <h2 className="font-[Poppins] text-3xl font-semibold">Your Upcoming Events</h2>
          <button onClick={() => navigate("/dashboard/events/my")} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-violet-700">
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div>
          {upcomingEvents.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-500">
              <p>No upcoming events. Browse events to register!</p>
              <button onClick={() => navigate("/dashboard/events")} className="mt-3 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-violet-700 hover:bg-violet-800 transition-colors">
                Browse Events
              </button>
            </div>
          ) : (
            upcomingEvents.slice(0, 3).map((event, index) => {
              const startDate = new Date(event.startDate);
              const month = startDate.toLocaleString("en-US", { month: "short" });
              const day = startDate.getDate();
              return (
                <div key={event._id || event.id} className={`flex flex-col gap-5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between ${index !== Math.min(upcomingEvents.length, 3) - 1 ? "border-b border-slate-100" : ""}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg bg-violet-100">
                      <span className="text-xs font-semibold uppercase tracking-wide text-violet-700">{month}</span>
                      <span className="font-[Poppins] text-xl font-semibold text-violet-700">{day}</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-semibold text-slate-900">{event.title || event.name}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Clock3 size={14} />{event.startTime || "All day"}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} />{event.venue || event.location}</span>
                      </div>
                    </div>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    <Ticket size={15} />View Ticket
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="space-y-2">
        <div>
          <h2 className="font-[Poppins] text-4xl font-semibold text-slate-900">Recommended for You</h2>
          <p className="mt-1 text-slate-500">
            {recommended.length > 0 ? "Based on your interests." : "Set your interests in Settings to get personalized recommendations."}
          </p>
        </div>
        {recommended.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recommended.slice(0, 6).map((event) => {
              const startDate = new Date(event.startDate);
              return (
                <div key={event._id || event.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="relative h-52 overflow-hidden">
                    <img src={event.coverImage || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop"} alt={event.name} className="h-full w-full object-cover" />
                    <div className="absolute left-3 top-3 rounded-md bg-white px-2 py-1 text-xs font-semibold text-violet-700 shadow">{event.category}</div>
                  </div>
                  <div className="space-y-4 p-4">
                    <h3 className="font-[Poppins] text-2xl font-semibold leading-snug text-slate-900">{event.name}</h3>
                    <div className="space-y-2 text-sm text-slate-500">
                      <div className="flex items-center gap-2"><CalendarDays size={14} />{startDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
                      <div className="flex items-center gap-2"><MapPin size={14} />{event.venue}</div>
                    </div>
                    <button className="w-full rounded-xl bg-violet-700 py-3 text-sm font-semibold text-white transition hover:bg-violet-800">Register Now</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
