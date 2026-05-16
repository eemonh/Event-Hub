import { 
  Calendar, 
  UserPlus, 
  Banknote, 
  TrendingUp, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  Palette, 
  Utensils,
  ArrowRight
} from 'lucide-react';
import MockupLayout from './MockupLayout';

// --- MOCK DATA ---
const statsData = [
  {
    id: 1,
    title: 'TOTAL EVENTS',
    value: '24',
    trend: '+12%',
    trendText: 'from last month',
    icon: Calendar,
    colorClass: 'text-purple-600 bg-purple-100',
    gradientClass: 'bg-gradient-to-t from-purple-50 to-white'
  },
  {
    id: 2,
    title: 'TOTAL REGISTRATION',
    value: '1,840',
    trend: '+5.4%',
    trendText: 'from last month',
    icon: UserPlus,
    colorClass: 'text-blue-600 bg-blue-100',
    gradientClass: 'bg-gradient-to-t from-blue-50 to-white'
  },
  {
    id: 3,
    title: 'MONTHLY REVENUE',
    value: '$12,450',
    trend: '+8.2%',
    trendText: 'from last month',
    icon: Banknote,
    colorClass: 'text-emerald-600 bg-emerald-100',
    gradientClass: 'bg-gradient-to-t from-emerald-50 to-white'
  }
];

const upcomingEvents = [
  {
    id: 'EVT-2024-001',
    name: 'Tech Innovators Summit',
    date: 'Oct 15, 2024',
    time: '09:00 AM - 05:00 PM',
    venue: 'Moscone Center, SF',
    status: 'Live',
    statusColor: 'bg-emerald-100 text-emerald-700',
    icon: Activity,
    iconColor: 'bg-purple-100 text-purple-600'
  },
  {
    id: 'EVT-2024-002',
    name: 'Design Leadership Workshop',
    date: 'Oct 22, 2024',
    time: '10:00 AM - 02:00 PM',
    venue: 'Virtual (Zoom)',
    status: 'Draft',
    statusColor: 'bg-gray-100 text-gray-700',
    icon: Palette,
    iconColor: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'EVT-2024-003',
    name: 'Annual Charity Gala',
    date: 'Nov 05, 2024',
    time: '07:00 PM - 11:30 PM',
    venue: 'Grand Hotel, NY',
    status: 'Review',
    statusColor: 'bg-blue-100 text-blue-700',
    icon: Utensils,
    iconColor: 'bg-amber-100 text-amber-700'
  }
];

export default function AdminDashboard() {
  return (
    <MockupLayout 
      breadcrumbs={['Dashboard', 'Overview']} 
      actionLabel="Create Event"
    >
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">Here's what's happening with your events today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.id} 
              className={`border border-gray-100 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden ${stat.gradientClass}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">
                    {stat.title}
                  </h3>
                  <div className="text-4xl font-extrabold text-gray-900">
                    {stat.value}
                  </div>
                </div>
                <div className={`p-2.5 rounded-xl ${stat.colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              
              <div className="flex items-center text-sm mt-2">
                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1.5" />
                <span className="text-emerald-600 font-semibold mr-2">{stat.trend}</span>
                <span className="text-gray-400">{stat.trendText}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Table Header Area */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Upcoming Events</h2>
          <button className="text-[#6200ea] hover:text-[#5200c3] text-sm font-semibold flex items-center transition-colors">
            View All
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Event Name</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Venue</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {upcomingEvents.map((event) => {
                const EventIcon = event.icon;
                return (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    {/* Event Name Column */}
                    <td className="px-6 py-4 flex items-center">
                      <div className={`p-2.5 rounded-xl mr-4 ${event.iconColor}`}>
                        <EventIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm mb-0.5">{event.name}</div>
                        <div className="text-xs text-gray-400">ID: {event.id}</div>
                      </div>
                    </td>
                    
                    {/* Date & Time Column */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-800 mb-0.5">{event.date}</div>
                      <div className="text-xs text-gray-400">{event.time}</div>
                    </td>
                    
                    {/* Venue Column */}
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {event.venue}
                    </td>
                    
                    {/* Status Column */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${event.statusColor}`}>
                        {event.status}
                      </span>
                    </td>
                    
                    {/* Actions Column */}
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <div>
            Showing <span className="font-semibold text-gray-700">1</span> to <span className="font-semibold text-gray-700">3</span> of <span className="font-semibold text-gray-700">24</span> entries
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-900 font-semibold text-xs">
              1
            </button>
            <button className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
      </div>
    </MockupLayout>
  );
}