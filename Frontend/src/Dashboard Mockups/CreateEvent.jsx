import { X, ChevronDown, Calendar, MapPin } from 'lucide-react';
import MockupLayout from './MockupLayout';

export default function CreateEvent({ onClose }) {
  return (
    <MockupLayout 
      breadcrumbs={['Dashboard', 'Events', 'Create']} 
      actionLabel="Cancel"
      onAction={onClose}
    >
      {/* Modal Overlay Background (Simulated inside layout) */}
      <div className="flex items-center justify-center p-4 font-sans">
        
        {/* Modal Container */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-[700px] flex flex-col overflow-hidden">
          
          {/* Modal Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-50"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body / Form */}
          <div className="p-8 bg-white overflow-y-auto max-h-[75vh]">
            <form className="space-y-6">
              
              {/* Row 1: Event Name & Event Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter event name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all"
                  />
                </div>

                {/* Event Type */}
                <div className="relative">
                  <label className="block text-xs font-bold text-gray-500 mb-2">
                    Event Type
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none transition-all cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled className="text-gray-400">Select event type</option>
                      <option value="conference">Conference</option>
                      <option value="workshop">Workshop</option>
                      <option value="meetup">Meetup</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2: Start Date & End Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date & Time */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">
                    Start Date & Time
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="mm/dd/yyyy, --:-- --"
                      className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* End Date & Time */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">
                    End Date & Time
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="mm/dd/yyyy, --:-- --"
                      className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 3: Venue / Location */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">
                  Venue / Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for a venue or address"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all"
                  />
                </div>
              </div>

              {/* Row 4: Cover Image */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">
                  Cover Image
                </label>
                <input
                  type="text"
                  placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all"
                />
              </div>

              {/* Row 5: Event Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">
                  Event Description
                </label>
                <textarea
                  rows="4"
                  placeholder="Provide details about your event..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all resize-y"
                ></textarea>
              </div>

            </form>
          </div>

          {/* Modal Footer */}
          <div className="px-8 py-5 border-t border-gray-100 flex justify-end gap-4 bg-white rounded-b-xl">
            <button 
              onClick={onClose}
              type="button"
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-[#6200ea] hover:bg-[#5200c3] transition-colors shadow-sm"
            >
              Create Event
            </button>
          </div>

        </div>
      </div>
    </MockupLayout>
  );
}