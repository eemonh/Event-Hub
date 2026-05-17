import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Calendar, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { createEvent } from "../../services/events";

const CATEGORIES = ["Technology", "Design", "Business", "Startup", "Music", "Arts", "Health", "Sports", "Education", "Food & Drink", "Networking", "Other"];

export default function CreateEventPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "", type: "", category: "", startDate: "", startTime: "",
    endDate: "", endTime: "", venue: "", coverImage: "", description: "",
    capacity: "", price: "0", status: "published",
  });

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Events", "Create"]);
    setAction(null);
  }, [setBreadcrumbs, setAction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.startDate || !formData.venue || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await createEvent(token, {
        name: formData.name, type: formData.type, category: formData.category,
        startDate: formData.startDate, endDate: formData.endDate || formData.startDate,
        startTime: formData.startTime, endTime: formData.endTime,
        venue: formData.venue, coverImage: formData.coverImage, description: formData.description,
        capacity: parseInt(formData.capacity) || 100, price: parseFloat(formData.price) || 0,
        status: formData.status,
      });
      toast.success("Event created successfully!");
      navigate("/dashboard/events/manage");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
        <p className="text-gray-500 text-sm">Fill in the details below to create a new event.</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-[700px]">
        <div className="p-8">
          <form id="event-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Event Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter event name" required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all" />
              </div>
              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 mb-2">Event Type *</label>
                <div className="relative">
                  <select name="type" value={formData.type} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none transition-all cursor-pointer">
                    <option value="" disabled>Select event type</option>
                    <option value="Conference">Conference</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Meetup">Meetup</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Networking">Networking</option>
                    <option value="Concert">Concert</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Festival">Festival</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Category *</label>
              <div className="relative">
                <select name="category" value={formData.category} onChange={handleChange} required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none transition-all cursor-pointer">
                  <option value="" disabled>Select category</option>
                  {CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Start Date *</label>
                <div className="relative">
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required
                    className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Start Time</label>
                <input type="time" name="startTime" value={formData.startTime} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">End Date</label>
                <div className="relative">
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">End Time</label>
                <input type="time" name="endTime" value={formData.endTime} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Venue / Location *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><MapPin className="w-4 h-4 text-gray-400" /></div>
                <input type="text" name="venue" value={formData.venue} onChange={handleChange} placeholder="Search for a venue or address" required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Capacity</label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="e.g. 100" min="1"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Price ($)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0 = Free" min="0" step="0.01"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Status</label>
                <div className="relative">
                  <select name="status" value={formData.status} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none transition-all cursor-pointer">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Cover Image URL</label>
              <input type="url" name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Event Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Provide details about your event..."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all resize-y"></textarea>
            </div>
          </form>
        </div>
        <div className="px-8 py-5 border-t border-gray-100 flex justify-end gap-4 bg-white rounded-b-xl">
          <button onClick={() => navigate("/dashboard/events/manage")} type="button"
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">Cancel</button>
          <button type="submit" form="event-form" disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-violet-700 hover:bg-violet-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? "Creating..." : "Create Event"}</button>
        </div>
      </div>
    </main>
  );
}
