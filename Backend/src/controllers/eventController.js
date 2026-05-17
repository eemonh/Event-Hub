import Event, { CATEGORIES } from "../models/Event.js";
import Registration from "../models/Registration.js";
import Bookmark from "../models/Bookmark.js";

export async function listEvents(req, res) {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const filter = { status: "published" };
    if (category && CATEGORIES.includes(category)) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const events = await Event.find(filter)
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("organizer", "name email");
    const total = await Event.countDocuments(filter);
    res.json({ events, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getEvent(req, res) {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "name email");
    if (!event) return res.status(404).json({ message: "Event not found" });
    const registrationCount = await Registration.countDocuments({ event: event._id });
    const bookmarkCount = await Bookmark.countDocuments({ event: event._id });
    res.json({ event: { ...event.toJSON(), registrationCount, bookmarkCount } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createEvent(req, res) {
  try {
    const eventData = { ...req.body, organizer: req.user._id };
    const event = await Event.create(eventData);
    res.status(201).json({ event: event.toJSON() });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: error.message });
  }
}

export async function updateEvent(req, res) {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ event: event.toJSON() });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: error.message });
  }
}

export async function deleteEvent(req, res) {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    await Registration.deleteMany({ event: event._id });
    await Bookmark.deleteMany({ event: event._id });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getMyEvents(req, res) {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate("event")
      .sort({ registeredAt: -1 });
    const events = registrations
      .filter((r) => r.event)
      .map((r) => ({
        ...r.event.toJSON(),
        registeredAt: r.registeredAt,
        registrationId: r._id,
      }));
    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getSavedEvents(req, res) {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate("event")
      .sort({ savedAt: -1 });
    const events = bookmarks
      .filter((b) => b.event)
      .map((b) => ({
        ...b.event.toJSON(),
        savedAt: b.savedAt,
        bookmarkId: b._id,
      }));
    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getRecommendedEvents(req, res) {
  try {
    const user = req.user;
    const registeredEventIds = (
      await Registration.find({ user: user._id }).select("event")
    ).map((r) => r.event);
    const bookmarkedEventIds = (
      await Bookmark.find({ user: user._id }).select("event")
    ).map((b) => b.event);
    const excludeIds = [...new Set([...registeredEventIds, ...bookmarkedEventIds])];

    const filter = { status: "published" };
    if (user.interests && user.interests.length > 0) {
      filter.category = { $in: user.interests };
    }
    if (excludeIds.length > 0) {
      filter._id = { $nin: excludeIds };
    }

    const events = await Event.find(filter)
      .sort({ startDate: 1 })
      .limit(12)
      .populate("organizer", "name email");
    res.json({ events: events.map((e) => e.toJSON()) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function registerForEvent(req, res) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.status !== "published") return res.status(400).json({ message: "Event is not open for registration" });

    const existing = await Registration.findOne({ user: req.user._id, event: event._id });
    if (existing) return res.status(400).json({ message: "Already registered for this event" });

    const registrationCount = await Registration.countDocuments({ event: event._id });
    if (registrationCount >= event.capacity) return res.status(400).json({ message: "Event is at full capacity" });

    const registration = await Registration.create({ user: req.user._id, event: event._id });
    res.status(201).json({ registration: registration.toJSON() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function cancelRegistration(req, res) {
  try {
    const registration = await Registration.findOneAndDelete({
      user: req.user._id,
      event: req.params.id,
    });
    if (!registration) return res.status(404).json({ message: "Registration not found" });
    res.json({ message: "Registration cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function bookmarkEvent(req, res) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const existing = await Bookmark.findOne({ user: req.user._id, event: event._id });
    if (existing) return res.status(400).json({ message: "Event already bookmarked" });

    const bookmark = await Bookmark.create({ user: req.user._id, event: event._id });
    res.status(201).json({ bookmark: bookmark.toJSON() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function removeBookmark(req, res) {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      user: req.user._id,
      event: req.params.id,
    });
    if (!bookmark) return res.status(404).json({ message: "Bookmark not found" });
    res.json({ message: "Bookmark removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getAllEvents(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const events = await Event.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("organizer", "name email");
    const total = await Event.countDocuments();
    res.json({ events: events.map((e) => e.toJSON()), total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
