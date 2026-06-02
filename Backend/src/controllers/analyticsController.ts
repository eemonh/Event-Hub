import { Request, Response } from "express";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import User from "../models/User.js";

function getMonthRange(monthsAgo = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const end = monthsAgo === 0
    ? now
    : new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 1);
  return { start, end };
}

export async function getOverview(req: Request, res: Response) {
  try {
    const { start: thisMonthStart } = getMonthRange(0);
    const { start: lastMonthStart, end: lastMonthEnd } = getMonthRange(1);

    const [
      totalEvents,
      totalRegistrations,
      totalUsers,
      totalCapacityResult,
      upcomingEvents,
      eventsThisMonth,
      eventsLastMonth,
      regsThisMonth,
      regsLastMonth,
      usersThisMonth,
      usersLastMonth,
    ] = await Promise.all([
      Event.countDocuments(),
      Registration.countDocuments(),
      User.countDocuments(),
      Event.aggregate([
        { $group: { _id: null, total: { $sum: "$capacity" } } },
      ]),
      Event.countDocuments({ startDate: { $gte: new Date() } }),
      Event.countDocuments({ createdAt: { $gte: thisMonthStart } }),
      Event.countDocuments({
        createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd },
      }),
      Registration.countDocuments({ registeredAt: { $gte: thisMonthStart } }),
      Registration.countDocuments({
        registeredAt: { $gte: lastMonthStart, $lt: lastMonthEnd },
      }),
      User.countDocuments({ createdAt: { $gte: thisMonthStart } }),
      User.countDocuments({
        createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd },
      }),
    ]);

    const totalCapacity = totalCapacityResult[0]?.total || 0;
    const capacityFillRate = totalCapacity
      ? Math.round((totalRegistrations / totalCapacity) * 100)
      : 0;

    const revenueResult = await Registration.aggregate([
      { $lookup: { from: "events", localField: "event", foreignField: "_id", as: "event" } },
      { $unwind: "$event" },
      { $group: { _id: null, total: { $sum: "$event.price" } } },
    ]);
    const estimatedRevenue = revenueResult[0]?.total || 0;

    const revenueThisMonth = await Registration.aggregate([
      { $match: { registeredAt: { $gte: thisMonthStart } } },
      { $lookup: { from: "events", localField: "event", foreignField: "_id", as: "event" } },
      { $unwind: "$event" },
      { $group: { _id: null, total: { $sum: "$event.price" } } },
    ]);
    const revenueLastMonth = await Registration.aggregate([
      { $match: { registeredAt: { $gte: lastMonthStart, $lt: lastMonthEnd } } },
      { $lookup: { from: "events", localField: "event", foreignField: "_id", as: "event" } },
      { $unwind: "$event" },
      { $group: { _id: null, total: { $sum: "$event.price" } } },
    ]);

    const calcTrend = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100 * 10) / 10;
    };

    const stats = {
      totalEvents: { value: totalEvents, trend: calcTrend(eventsThisMonth, eventsLastMonth) },
      totalRegistrations: { value: totalRegistrations, trend: calcTrend(regsThisMonth, regsLastMonth) },
      estimatedRevenue: { value: estimatedRevenue, trend: calcTrend(revenueThisMonth[0]?.total || 0, revenueLastMonth[0]?.total || 0) },
      totalUsers: { value: totalUsers, trend: calcTrend(usersThisMonth, usersLastMonth) },
      capacityFillRate: { value: `${capacityFillRate}%`, trend: 0 },
      upcomingEvents: { value: upcomingEvents, trend: 0 },
    };

    res.json({ stats });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ message });
  }
}

export async function getRegistrationTrends(req: Request, res: Response) {
  try {
    const days = parseInt(req.query.range as string) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const trends = await Registration.aggregate([
      { $match: { registeredAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$registeredAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const dateMap: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      dateMap[key] = 0;
    }
    trends.forEach((t) => { dateMap[t._id] = t.count; });

    const data = Object.entries(dateMap).map(([date, count]) => ({ date, count }));
    res.json({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ message });
  }
}

export async function getCategoryBreakdown(req: Request, res: Response) {
  try {
    const [byCategory, byStatus] = await Promise.all([
      Event.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Event.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.json({ byCategory, byStatus });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ message });
  }
}

export async function getEventPerformance(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = req.query.sort as string || "registrations";
    const skip = (page - 1) * limit;

    const sortField = sort === "fillRate" ? "fillRate"
      : sort === "bookmarks" ? "bookmarkCount"
      : "registrationCount";

    const events = await Event.aggregate([
      { $lookup: { from: "registrations", localField: "_id", foreignField: "event", as: "registrations" } },
      { $lookup: { from: "bookmarks", localField: "_id", foreignField: "event", as: "bookmarks" } },
      {
        $addFields: {
          registrationCount: { $size: "$registrations" },
          bookmarkCount: { $size: "$bookmarks" },
          fillRate: {
            $cond: {
              if: { $gt: ["$capacity", 0] },
              then: { $round: [{ $multiply: [{ $divide: [{ $size: "$registrations" }, "$capacity"] }, 100] }, 0] },
              else: 0,
            },
          },
        },
      },
      { $sort: { [sortField]: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1, name: 1, startDate: 1, status: 1,
          capacity: 1, price: 1, registrationCount: 1,
          bookmarkCount: 1, fillRate: 1,
        },
      },
    ]);

    const total = await Event.countDocuments();
    res.json({ events, total, page, pages: Math.ceil(total / limit) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ message });
  }
}

export async function getUserGrowth(req: Request, res: Response) {
  try {
    const days = parseInt(req.query.range as string) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const growth = await User.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const dateMap: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      dateMap[key] = 0;
    }
    growth.forEach((g) => { dateMap[g._id] = g.count; });

    const data = Object.entries(dateMap).map(([date, count]) => ({ date, count }));
    res.json({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ message });
  }
}

export async function getTopEvents(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 5;

    const events = await Event.aggregate([
      { $match: { status: "published" } },
      { $lookup: { from: "registrations", localField: "_id", foreignField: "event", as: "registrations" } },
      { $lookup: { from: "bookmarks", localField: "_id", foreignField: "event", as: "bookmarks" } },
      {
        $addFields: {
          registrationCount: { $size: "$registrations" },
          bookmarkCount: { $size: "$bookmarks" },
          fillRate: {
            $cond: {
              if: { $gt: ["$capacity", 0] },
              then: { $round: [{ $multiply: [{ $divide: [{ $size: "$registrations" }, "$capacity"] }, 100] }, 0] },
              else: 0,
            },
          },
          estimatedRevenue: { $multiply: ["$price", { $size: "$registrations" }] },
        },
      },
      { $sort: { registrationCount: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 1, name: 1, startDate: 1, category: 1,
          capacity: 1, price: 1, registrationCount: 1,
          bookmarkCount: 1, fillRate: 1, estimatedRevenue: 1,
        },
      },
    ]);

    res.json({ events });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ message });
  }
}
