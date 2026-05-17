import React from 'react';

export default function ExploreEvents() {
  const events = [
    {
      id: 1,
      category: "Tech",
      title: "Global Tech Innovators Summit 2024",
      date: "Oct 15, 2024 • 9:00 AM PST",
      location: "Moscone Center, San Francisco",
      organizer: "TechVentures Inc.",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      category: "Music",
      title: "Neon Nights Indie Festival",
      date: "Nov 02, 2024 • 4:00 PM EST",
      location: "Central Park Main Stage, NY",
      organizer: "LiveNation",
      imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      category: "Business",
      title: "Executive Leadership Masterclass",
      date: "Oct 20, 2024 • 10:00 AM GMT",
      location: "The Shard, London (Virtual option)",
      organizer: "Harvard Business Review",
      imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 4,
      category: "Health",
      title: "Mindful Morning: Outdoor Yoga & Meditation",
      date: "Oct 18, 2024 • 7:00 AM PST",
      location: "Golden Gate Park, SF",
      organizer: "ZenFlow Studios",
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 5,
      category: "Tech",
      title: "DataHack 24-Hour Challenge",
      date: "Nov 10, 2024 • 6:00 PM EST",
      location: "MIT Stata Center, Boston",
      organizer: "DataScience Org",
      imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 6,
      category: "Design",
      title: "UX/UI Design Thinking Sprint",
      date: "Dec 05, 2024 • 1:00 PM CET",
      location: "Design Haus, Berlin",
      organizer: "Creative Collective",
      imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[#111827] tracking-tight mb-2">
            Explore Events
          </h1>
          <p className="text-slate-500 text-base">
            Discover the best events happening around you.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-3 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-200 mb-10 flex flex-col md:flex-row gap-4">
          
          {/* Search Input */}
          <div className="flex-grow flex items-center bg-[#F8F9FA] rounded-xl px-4 py-2 border border-slate-100 focus-within:ring-2 focus-within:ring-[#6224D6] focus-within:border-transparent transition-all">
            <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search events..." 
              className="w-full bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-sm"
            />
          </div>

          {/* Dropdowns */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <div className="relative w-full sm:w-auto">
              <select className="w-full sm:w-44 appearance-none bg-[#F8F9FA] border border-slate-100 text-slate-700 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#6224D6] cursor-pointer">
                <option>All Categories</option>
                <option>Tech</option>
                <option>Music</option>
                <option>Business</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="relative w-full sm:w-auto">
              <select className="w-full sm:w-40 appearance-none bg-[#F8F9FA] border border-slate-100 text-slate-700 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#6224D6] cursor-pointer">
                <option>Any Date</option>
                <option>Today</option>
                <option>This Weekend</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="relative w-full sm:w-auto">
              <select className="w-full sm:w-44 appearance-none bg-[#F8F9FA] border border-slate-100 text-slate-700 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#6224D6] cursor-pointer">
                <option>Sort: Upcoming</option>
                <option>Price: Low to High</option>
                <option>Distance</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:shadow-lg transition-shadow duration-300 flex flex-col">
              
              {/* Card Image area */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-200">
                <img 
                  src={event.imageUrl} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 tracking-wide shadow-sm">
                  {event.category}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-5 leading-tight line-clamp-2">
                  {event.title}
                </h3>
                
                <div className="space-y-3 mb-6 flex-grow">
                  {/* Date */}
                  <div className="flex items-start text-slate-500 text-sm">
                    <svg className="w-4 h-4 mr-2.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{event.date}</span>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-start text-slate-500 text-sm">
                    <svg className="w-4 h-4 mr-2.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>

                  {/* Organizer */}
                  <div className="flex items-start text-slate-500 text-sm">
                    <svg className="w-4 h-4 mr-2.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{event.organizer}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex gap-3 mt-auto">
                  <button className="flex-grow bg-[#6224D6] hover:bg-[#501DB1] text-white font-semibold py-2.5 rounded-xl transition-colors text-sm shadow-sm">
                    Register
                  </button>
                  <button className="flex items-center justify-center w-11 h-11 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center">
          <button className="bg-transparent border-2 border-[#6224D6] text-[#6224D6] hover:bg-[#F3F0FF] font-bold py-3 px-8 rounded-xl transition-colors shadow-sm">
            Load More Events
          </button>
        </div>

      </div>
    </div>
  );
}