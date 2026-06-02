import mongoose, { Schema } from 'mongoose';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Bookmark from '../models/Bookmark.js';
import Upvote from '../models/Upvote.js';
import Comment from '../models/Comment.js';
import { extractKeywords, buildKeywordProfile, computeKeywordSimilarity } from './keywordExtractor.js';
import * as cache from './cache.js';

export function computeCategoryScore(userInterests: string[] | null | undefined, eventCategory: string | null | undefined): number {
  if (!userInterests || userInterests.length === 0) return 0;
  if (!eventCategory) return 0;
  if (userInterests.includes(eventCategory)) {
    return 1 / userInterests.length;
  }
  return 0;
}

export function computeRecencyScore(startDate: Date | string | null | undefined): number {
  if (!startDate) return 0;
  const now = new Date();
  const eventDate = new Date(startDate);
  if (eventDate < now) return 0;
  const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntil >= 7 && daysUntil <= 30) return 1.0;
  if (daysUntil === 0) return 0.7;
  if (daysUntil > 30) return Math.max(0.5, 1.0 - (daysUntil - 30) * 0.01);
  if (daysUntil < 7) return 0.7 + (daysUntil / 7) * 0.3;
  return 0;
}

export function computeCompositePopularity(
  regCount: number,
  upvoteCount: number,
  commentCount: number,
  maxRegs: number,
  maxUpvotes: number,
  maxComments: number
): number {
  const regScore = maxRegs > 0 ? (regCount || 0) / maxRegs : 0;
  const upvoteScore = maxUpvotes > 0 ? (upvoteCount || 0) / maxUpvotes : 0;
  const commentScore = maxComments > 0 ? (commentCount || 0) / maxComments : 0;

  const raw = 0.5 * regScore + 0.3 * upvoteScore + 0.2 * commentScore;
  return Math.max(0.1, Math.min(1, raw));
}

interface CollabModels {
  Registration: mongoose.Model<any>;
  Bookmark: mongoose.Model<any>;
  Upvote: mongoose.Model<any>;
}

export async function getCollaborativeScores(
  userId: mongoose.Types.ObjectId | string,
  excludeIds: (mongoose.Types.ObjectId | string)[],
  models: CollabModels
): Promise<Map<string, number>> {
  const userRegs = await models.Registration.find({ user: userId }).select('event').lean();
  const userBookmarks = await models.Bookmark.find({ user: userId }).select('event').lean();
  const userUpvotes = await models.Upvote.find({ user: userId }).select('event').lean();

  const seedEventIds = [
    ...new Set([
      ...userRegs.map((r: any) => r.event.toString()),
      ...userBookmarks.map((b: any) => b.event.toString()),
      ...userUpvotes.map((u: any) => u.event.toString()),
    ]),
  ];
  if (seedEventIds.length === 0) return new Map();

  const similarRegUsers = await models.Registration.distinct('user', { event: { $in: seedEventIds }, user: { $ne: userId } });
  const similarBmUsers = await models.Bookmark.distinct('user', { event: { $in: seedEventIds }, user: { $ne: userId } });
  const similarUpUsers = await models.Upvote.distinct('user', { event: { $in: seedEventIds }, user: { $ne: userId } });

  const similarUserIds = [
    ...new Set([
      ...similarRegUsers.map((id: any) => id.toString()),
      ...similarBmUsers.map((id: any) => id.toString()),
      ...similarUpUsers.map((id: any) => id.toString()),
    ]),
  ];
  if (similarUserIds.length === 0) return new Map();

  const allExcludeIds = [...new Set([...seedEventIds, ...excludeIds.map(id => id.toString())])];

  const collabFromRegs = await models.Registration.aggregate([
    { $match: { user: { $in: similarUserIds.map(id => new mongoose.Types.ObjectId(id)) }, event: { $nin: allExcludeIds.map(id => new mongoose.Types.ObjectId(id)) } } },
    { $group: { _id: '$event', count: { $sum: 1 } } },
  ]);
  const collabFromBms = await models.Bookmark.aggregate([
    { $match: { user: { $in: similarUserIds.map(id => new mongoose.Types.ObjectId(id)) }, event: { $nin: allExcludeIds.map(id => new mongoose.Types.ObjectId(id)) } } },
    { $group: { _id: '$event', count: { $sum: 1 } } },
  ]);
  const collabFromUps = await models.Upvote.aggregate([
    { $match: { user: { $in: similarUserIds.map(id => new mongoose.Types.ObjectId(id)) }, event: { $nin: allExcludeIds.map(id => new mongoose.Types.ObjectId(id)) } } },
    { $group: { _id: '$event', count: { $sum: 1 } } },
  ]);

  const merged: Record<string, number> = {};
  for (const r of collabFromRegs) merged[r._id.toString()] = (merged[r._id.toString()] || 0) + r.count;
  for (const b of collabFromBms) merged[b._id.toString()] = (merged[b._id.toString()] || 0) + b.count;
  for (const u of collabFromUps) merged[u._id.toString()] = (merged[u._id.toString()] || 0) + u.count;

  const values = Object.values(merged);
  const maxCount = values.length > 0 ? Math.max(...values, 1) : 1;
  const scores = new Map<string, number>();
  for (const [eid, count] of Object.entries(merged)) {
    scores.set(eid, count / maxCount);
  }
  return scores;
}

interface UpvoteModels {
  Upvote: mongoose.Model<any>;
}

export async function getUpvoteAffinityScores(
  userId: mongoose.Types.ObjectId | string,
  excludeIds: (mongoose.Types.ObjectId | string)[],
  models: UpvoteModels
): Promise<Map<string, number>> {
  const userUpvotes = await models.Upvote.find({ user: userId }).select('event').lean();
  const upvotedEventIds = userUpvotes.map((u: any) => u.event.toString());
  if (upvotedEventIds.length === 0) return new Map();

  const upvoters = await models.Upvote.distinct('user', { event: { $in: upvotedEventIds }, user: { $ne: userId } });
  if (upvoters.length === 0) return new Map();

  const allExcludeIds = [...new Set([...upvotedEventIds, ...excludeIds.map(id => id.toString())])];

  const affinity = await models.Upvote.aggregate([
    { $match: { user: { $in: upvoters.map(id => new mongoose.Types.ObjectId(id)) }, event: { $nin: allExcludeIds.map(id => new mongoose.Types.ObjectId(id)) } } },
    { $group: { _id: '$event', count: { $sum: 1 } } },
  ]);

  const counts = affinity.map(a => a.count);
  const maxCount = counts.length > 0 ? Math.max(...counts, 1) : 1;
  const scores = new Map<string, number>();
  for (const a of affinity) {
    scores.set(a._id.toString(), a.count / maxCount);
  }
  return scores;
}

interface CommentModels {
  Comment: mongoose.Model<any>;
}

export async function getCommentKeywordScores(
  userId: mongoose.Types.ObjectId | string,
  eventIds: (mongoose.Types.ObjectId | string)[],
  models: CommentModels
): Promise<Map<string, number>> {
  const userComments = await models.Comment.find({ user: userId }).select('text').lean();
  if (userComments.length === 0) return new Map();

  const userTexts = userComments.map((c: any) => c.text);
  const userProfile = buildKeywordProfile(userTexts);
  if (Object.keys(userProfile).length === 0) return new Map();

  const allEventComments = await models.Comment.aggregate([
    { $match: { event: { $in: eventIds.map(id => new mongoose.Types.ObjectId(id)) } } },
    { $group: { _id: '$event', texts: { $push: '$text' } } },
  ]);

  const scores = new Map<string, number>();
  for (const group of allEventComments) {
    const eventKeywords: string[] = [];
    for (const text of group.texts) {
      eventKeywords.push(...extractKeywords(text));
    }
    const similarity = computeKeywordSimilarity(userProfile, [...new Set(eventKeywords)]);
    if (similarity > 0) {
      scores.set(group._id.toString(), similarity);
    }
  }
  return scores;
}

interface ReasonScores {
  category: number;
  collaborative: number;
  popularity: number;
  recency: number;
  keywordMatch: number;
  upvoteAffinity: number;
}

export function computeReason(scores: ReasonScores): string {
  const parts: string[] = [];
  if (scores.category > 0) parts.push('Matches your interests');
  if (scores.keywordMatch > 0.3) parts.push('Matches topics you comment about');
  if (scores.collaborative > 0.5) parts.push('Popular with similar attendees');
  if (scores.upvoteAffinity > 0.5) parts.push('Upvoted by people with similar taste');
  if (scores.popularity > 0.7) parts.push('Trending event');
  if (scores.recency >= 1.0) parts.push('Coming up soon');
  if (parts.length === 0) {
    if (scores.popularity > 0.3) parts.push('Popular event');
    else parts.push('Recommended for you');
  }
  return parts[0];
}

export function clearRecommendationCache(userId: mongoose.Types.ObjectId | string): void {
  cache.remove(userId.toString());
}

export async function getRecommendations(user: any, excludeIds: (mongoose.Types.ObjectId | string)[]): Promise<any[]> {
  const cacheKey = user._id.toString();
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const userInterests = user.interests || [];
  const hasHistory = excludeIds.length > 0;

  const allPublished = await Event.find({ status: 'published', _id: { $nin: excludeIds } })
    .populate('organizer', 'name email')
    .lean();

  if (allPublished.length === 0) return [];
  const allEventIds = allPublished.map(e => e._id);

  const regCounts = await Registration.aggregate([
    { $match: { event: { $in: allEventIds } } },
    { $group: { _id: '$event', count: { $sum: 1 } } },
  ]);
  const regMap = new Map(regCounts.map(r => [r._id.toString(), r.count]));
  const regCountsValues = regCounts.map(r => r.count);
  const maxRegCount = regCountsValues.length > 0 ? Math.max(...regCountsValues, 1) : 1;

  const upvoteCounts = await Upvote.aggregate([
    { $match: { event: { $in: allEventIds } } },
    { $group: { _id: '$event', count: { $sum: 1 } } },
  ]);
  const upvoteMap = new Map(upvoteCounts.map(u => [u._id.toString(), u.count]));
  const upvoteCountsValues = upvoteCounts.map(u => u.count);
  const maxUpvoteCount = upvoteCountsValues.length > 0 ? Math.max(...upvoteCountsValues, 1) : 1;

  const commentCounts = await Comment.aggregate([
    { $match: { event: { $in: allEventIds } } },
    { $group: { _id: '$event', count: { $sum: 1 } } },
  ]);
  const commentMap = new Map(commentCounts.map(c => [c._id.toString(), c.count]));
  const commentCountsValues = commentCounts.map(c => c.count);
  const maxCommentCount = commentCountsValues.length > 0 ? Math.max(...commentCountsValues, 1) : 1;

  const collabScores = hasHistory
    ? await getCollaborativeScores(user._id, excludeIds, { Registration, Bookmark, Upvote })
    : new Map<string, number>();

  const upvoteAffinityScores = hasHistory
    ? await getUpvoteAffinityScores(user._id, excludeIds, { Upvote })
    : new Map<string, number>();

  const keywordScores = await getCommentKeywordScores(user._id, allEventIds, { Comment });

  const hasInterests = userInterests.length > 0;
  let catWeight: number, collabWeight: number, popWeight: number, recWeight: number, kwWeight: number, upAffWeight: number;

  if (!hasHistory && hasInterests) {
    catWeight = 0.40; popWeight = 0.30; recWeight = 0.20; collabWeight = 0; kwWeight = 0.10; upAffWeight = 0;
  } else if (!hasInterests) {
    catWeight = 0; popWeight = 0.35; collabWeight = 0.25; recWeight = 0.15; kwWeight = 0.10; upAffWeight = 0.15;
  } else {
    catWeight = 0.25; collabWeight = 0.20; popWeight = 0.15; recWeight = 0.10; kwWeight = 0.10; upAffWeight = 0.20;
  }

  const scored = allPublished.map((event: any) => {
    const eventId = event._id.toString();
    const category = computeCategoryScore(userInterests, event.category);
    const collaborative = collabScores.get(eventId) || 0;
    const upvoteAffinity = upvoteAffinityScores.get(eventId) || 0;
    const popularity = computeCompositePopularity(
      regMap.get(eventId) || 0,
      upvoteMap.get(eventId) || 0,
      commentMap.get(eventId) || 0,
      maxRegCount,
      maxUpvoteCount,
      maxCommentCount
    );
    const recency = computeRecencyScore(event.startDate);
    const keywordMatch = keywordScores.get(eventId) || 0;

    const score = (catWeight * category)
      + (collabWeight * collaborative)
      + (popWeight * popularity)
      + (recWeight * recency)
      + (kwWeight * keywordMatch)
      + (upAffWeight * upvoteAffinity);

    const reason = computeReason({ category, collaborative, popularity, recency, keywordMatch, upvoteAffinity });

    return { ...event, score: Math.round(score * 100) / 100, reason };
  });

  scored.sort((a, b) => b.score - a.score);
  const result = scored.slice(0, 12);
  cache.set(cacheKey, result);
  return result;
}
