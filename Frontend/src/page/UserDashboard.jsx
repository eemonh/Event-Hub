import {
  LayoutDashboard,
  CalendarDays,
  Bookmark,
  LogOut,
  Ticket,
  Calendar,
  MapPin,
  ArrowRight,
  BookmarkCheck,
} from "lucide-react";

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

const recommendedEvents = [
  {
    title: "Future of Web Design Workshop",
    date: "Nov 15, 2024",
    location: "Seattle, WA",
    tag: "UX/UI",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Product Managers Networking Night",
    date: "Dec 05, 2024",
    location: "The Grand Hotel, NY",
    tag: "Leadership",
    image:
      "https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Founder’s Pitch & Mingle",
    date: "Jan 12, 2025",
    location: "Innovation Hub, Austin",
    tag: "Startup",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      
      {/* Sidebar */}
      <aside className="w-[232px] bg-white border-r border-[#E2E8F0] flex flex-col justify-between p-3">
        
        <div>
          {/* Logo */}
          <div className="mb-8 px-3">
            <h1 className="text-[32px] font-bold text-[#630ED4] font-['Poppins']">
              EventHub
            </h1>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-2">
            
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#4A4455] hover:bg-[#F1F5F9] transition">
              <LayoutDashboard size={18} />
              <span className="font-semibold text-[16px]">
                Dashboard
              </span>
            </button>

            <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#4A4455] hover:bg-[#F1F5F9] transition">
              <CalendarDays size={18} />
              <span className="font-semibold text-[16px]">
                My Events
              </span>
            </button>

            <button className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#EDE5F4] text-[#630ED4]">
              <Bookmark size={18} />
              <span className="font-bold text-[16px]">
                Saved Events
              </span>
            </button>
          </nav>
        </div>

        {/* Logout */}
        <button className="flex items-center justify-center gap-2 bg-[#BA1A1A] hover:bg-red-700 transition text-white rounded-lg py-3">
          <LogOut size={18} />
          <span className="font-semibold">Logout</span>
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        
        {/* Header */}
        <header className="h-[73px] bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6">
          <p className="text-[14px] text-[#64748B]">
            Dashboard
          </p>

          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="w-10 h-10 rounded-full border-2 border-[#E2E8F0]"
          />
        </header>

        {/* Content */}
        <div className="p-8 flex flex-col gap-8">
          
          {/* Welcome */}
          <section>
            <h2 className="text-[48px] leading-[58px] font-bold text-[#0F172A] font-['Poppins']">
              Welcome back, Alex!
            </h2>

            <p className="text-[16px] text-[#64748B] mt-2">
              You have{" "}
              <span className="text-[#630ED4] font-medium">
                2 upcoming events
              </span>{" "}
              this month. Get ready to connect and learn.
            </p>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[720px]">
            
            <div className="bg-white border border-[#E2E8F080] rounded-lg shadow-sm p-6 flex items-center gap-4">
              
              <div className="w-12 h-12 rounded-full bg-[#EDE5F4] flex items-center justify-center">
                <Ticket
                  size={20}
                  className="text-[#630ED4]"
                />
              </div>

              <div>
                <p className="text-[12px] tracking-[0.6px] font-semibold text-[#64748B] uppercase">
                  Total Registered Events
                </p>

                <h3 className="text-[32px] leading-[38px] font-bold text-[#0F172A] font-['Poppins']">
                  14
                </h3>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F080] rounded-lg shadow-sm p-6 flex items-center gap-4">
              
              <div className="w-12 h-12 rounded-full bg-[#EDE5F4] flex items-center justify-center">
                <BookmarkCheck
                  size={20}
                  className="text-[#630ED4]"
                />
              </div>

              <div>
                <p className="text-[12px] tracking-[0.6px] font-semibold text-[#64748B] uppercase">
                  Saved Events
                </p>

                <h3 className="text-[32px] leading-[38px] font-bold text-[#0F172A] font-['Poppins']">
                  6
                </h3>
              </div>
            </div>
          </section>

          {/* Upcoming Events */}
          <section className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]">
              <h3 className="text-[24px] font-bold text-[#0F172A] font-['Poppins']">
                Your Upcoming Events
              </h3>

              <button className="flex items-center gap-1 text-[#630ED4] text-sm font-semibold">
                View All
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="divide-y divide-[#E2E8F0]">
              {upcomingEvents.map((event) => (
                <div
                  key={event.title}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-4">
                    
                    <div className="w-[48px] h-[72px] rounded-lg bg-[#EDE5F4] flex flex-col items-center justify-center">
                      <span className="text-[12px] font-semibold text-[#630ED4] uppercase">
                        {event.date.split(" ")[0]}
                      </span>

                      <span className="text-[24px] font-bold text-[#630ED4] leading-none">
                        {event.date.split(" ")[1]}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-[24px] leading-[32px] font-semibold text-[#0F172A] font-['Poppins']">
                        {event.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-4 mt-1 text-[#64748B] text-sm">
                        
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {event.time}
                        </div>

                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="border border-[#D1D5DB] rounded-full px-4 py-2 text-sm font-semibold text-[#0F172A] hover:bg-gray-100 transition flex items-center gap-2">
                    <Ticket size={14} />
                    View Ticket
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended */}
          <section>
            <h3 className="text-[40px] leading-[48px] font-bold text-[#0F172A] font-['Poppins']">
              Recommended for You
            </h3>

            <p className="text-[#64748B] mt-2">
              Based on your interests in Technology and Design.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
              
              {recommendedEvents.map((event) => (
                <div
                  key={event.title}
                  className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden"
                >
                  
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-[180px] object-cover"
                    />

                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow">
                      <Bookmark size={16} />
                    </button>

                    <span className="absolute bottom-3 left-3 bg-white text-[#630ED4] text-xs font-semibold px-2 py-1 rounded">
                      {event.tag}
                    </span>
                  </div>

                  <div className="p-4">
                    <h4 className="text-[28px] leading-[36px] font-semibold text-[#0F172A] font-['Poppins']">
                      {event.title}
                    </h4>

                    <div className="flex flex-col gap-2 mt-3 text-sm text-[#64748B]">
                      
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {event.date}
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        {event.location}
                      </div>
                    </div>

                    <button className="w-full h-[44px] mt-5 rounded-lg bg-[#6D28D9] hover:bg-[#5B21B6] transition text-white font-semibold text-sm">
                      Register Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}