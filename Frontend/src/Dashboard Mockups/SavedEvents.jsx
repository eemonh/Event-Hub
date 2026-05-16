import React from 'react';
import { Calendar, MapPin, Bookmark } from 'lucide-react';

// --- MOCK DATA ---
const savedEvents = [
  {
    id: 1,
    title: 'Design Systems at Scale 2024',
    category: 'UX/UI',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    datetime: 'Oct 15, 2024 • 9:00 AM PST',
    location: 'San Francisco, CA',
    actionText: 'Register Now',
    actionType: 'primary'
  },
  {
    id: 2,
    title: 'Executive Leadership Summit',
    category: 'Leadership',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
    datetime: 'Nov 02, 2024 • 10:00 AM EST',
    location: 'New York, NY',
    actionText: 'View Details',
    actionType: 'secondary'
  },
  {
    id: 3,
    title: "Founder's Pitch Night",
    category: 'Startup',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=800',
    datetime: 'Nov 18, 2024 • 6:00 PM CST',
    location: 'Austin, TX',
    actionText: 'Register Now',
    actionType: 'primary'
  }
];

// --- SAVED EVENT CARD COMPONENT ---
const SavedEventCard = ({ event }) => {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Image Container with Overlay Badge */}
      <div className="relative h-48 w-full bg-gray-100">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <span className="text-xs font-bold text-gray-800 tracking-wide">
            {event.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title & Bookmark Row */}
        <div className="flex justify-between items-start mb-4 gap-4">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {event.title}
          </h3>
          <button className="text-[#6200ea] hover:text-[#5200c3] transition-colors flex-shrink-0 mt-1">
            {/* Adding fill="currentColor" to the Lucide icon makes it solid */}
            <Bookmark className="w-5 h-5" fill="currentColor" />
          </button>
        </div>

        {/* Details List */}
        <div className="space-y-3 mb-8 flex-grow">
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <Calendar className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
            {event.datetime}
          </div>
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <MapPin className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
            {event.location}
          </div>
        </div>

        {/* Action Button */}
        <button 
          className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-colors ${
            event.actionType === 'primary' 
              ? 'bg-[#6200ea] hover:bg-[#5200c3] text-white shadow-sm' 
              : 'bg-purple-100 hover:bg-purple-200 text-[#6200ea]'
          }`}
        >
          {event.actionText}
        </button>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function SavedEvents() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Events</h1>
        <p className="text-gray-500 text-base">Events you've bookmarked for later.</p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {savedEvents.map((event) => (
          <SavedEventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}