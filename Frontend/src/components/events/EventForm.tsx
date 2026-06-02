import { useState, type ChangeEvent, type FormEvent } from "react"
import { ChevronDown, Calendar, MapPin, Plus, Trash2, Loader2 } from "lucide-react"
import type { EventFormData, ScheduleItem } from "../../types"

const CATEGORIES = ["Technology", "Design", "Business", "Startup", "Music", "Arts", "Health", "Sports", "Education", "Food & Drink", "Networking", "Other"]

type EventFormState = Omit<EventFormData, "capacity" | "price" | "schedule"> & {
  capacity: string
  price: string
  schedule: ScheduleItem[]
}

const defaultForm: EventFormState = {
  name: "", type: "", category: "", startDate: "", startTime: "",
  endDate: "", endTime: "", venue: "", coverImage: "", description: "",
  capacity: "", price: "0", status: "published",
  subtitle: "", schedule: [],
}

interface EventFormProps {
  initialData?: Partial<EventFormState>
  onSubmit: (data: EventFormData) => void
  isSubmitting?: boolean
  onCancel?: () => void
}

export default function EventForm({ initialData, onSubmit, isSubmitting = false, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({ ...defaultForm, ...initialData })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleScheduleChange = (index: number, field: keyof ScheduleItem, value: string) => {
    setFormData((prev) => {
      const schedule = [...prev.schedule]
      schedule[index] = { ...schedule[index], [field]: value }
      return { ...prev, schedule }
    })
  }

  const addScheduleItem = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { day: "", time: "", title: "", description: "" }],
    }))
  }

  const removeScheduleItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.name || !formData.type || !formData.startDate || !formData.venue || !formData.category || !formData.description) return
    const payload = {
      name: formData.name, type: formData.type, category: formData.category,
      startDate: formData.startDate, endDate: formData.endDate || formData.startDate,
      startTime: formData.startTime, endTime: formData.endTime,
      venue: formData.venue, coverImage: formData.coverImage, description: formData.description,
      capacity: parseInt(formData.capacity) || 100, price: parseFloat(formData.price) || 0,
      status: formData.status,
      subtitle: formData.subtitle, schedule: formData.schedule,
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2">Subtitle</label>
        <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} placeholder="A short tagline under the title"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all" />
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
        <input type="text" name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all" />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2">Event Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Provide details about your event..." required
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all resize-y"></textarea>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-gray-500">Schedule Highlights</label>
          <button type="button" onClick={addScheduleItem}
            className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-50 transition-colors">
            <Plus size={14} /> Add Item
          </button>
        </div>
        {formData.schedule.map((item, i) => (
          <div key={i} className="relative rounded-lg border border-gray-200 bg-gray-50/30 p-4 space-y-3">
            <button type="button" onClick={() => removeScheduleItem(i)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 size={16} />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Day</label>
                <input type="text" value={item.day} onChange={(e) => handleScheduleChange(i, "day", e.target.value)} placeholder="e.g. Day 1"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Time</label>
                <input type="text" value={item.time} onChange={(e) => handleScheduleChange(i, "time", e.target.value)} placeholder="e.g. 09:00 AM"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1">Title</label>
              <input type="text" value={item.title} onChange={(e) => handleScheduleChange(i, "title", e.target.value)} placeholder="Session title"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1">Description</label>
              <textarea value={item.description} onChange={(e) => handleScheduleChange(i, "description", e.target.value)} rows={2} placeholder="Session description"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all resize-y"></textarea>
            </div>
          </div>
        ))}
        {formData.schedule.length === 0 && (
          <p className="text-xs text-gray-400 italic">No schedule items added yet.</p>
        )}
      </div>

      {onCancel && (
        <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
          {onCancel && (
            <button type="button" onClick={onCancel}
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
              Cancel
            </button>
          )}
          <button type="submit" disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-violet-700 hover:bg-violet-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2"><Loader2 size={16} className="animate-spin" />Saving...</span>
            ) : "Save Changes"}
          </button>
        </div>
      )}
    </form>
  )
}
