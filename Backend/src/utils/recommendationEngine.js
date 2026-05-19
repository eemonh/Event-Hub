import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Bookmark from '../models/Bookmark.js';
import Upvote from '../models/Upvote.js';
import Comment from '../models/Comment.js';
import { buildKeywordProfile, computeKeywordSimilarity } from './keywordExtractor.js';
import * as cache from './cache.js';

export function computeCategoryScore(userInterests, eventCategory) {
  if (!userInterests || userInterests.length === 0) return 0;
  if (!eventCategory) return 0;
  if (userInterests.includes(eventCategory)) {
    return 1 / userInterests.length;
  }
  return 0;
}

export function computeRecencyScore(startDate) {
  if (!startDate) return 0;
  const now = new Date();
  const eventDate = new Date(startDate);
  if (eventDate < now) return 0;
  const daysUntil = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
  if (daysUntil >= 7 && daysUntil <= 30) return 1.0;
  if (daysUntil === 0) return 0.7;
  if (daysUntil > 30) return Math.max(0.5, 1.0 - (daysUntil - 30) * 0.01);
  if (daysUntil < 7) return 0.7 + (daysUntil / 7) * 0.3;
  return 0;
}

export function computeCompositePopularity(regCount, upvoteCount, commentCount, maxRegs, maxUpvotes, maxComments) {
  const regScore = maxRegs > 0 ? (regCount || 0) / maxRegs : 0;
  const upvoteScore = maxUpvotes > 0 ? (upvoteCount || 0) / maxUpvotes : 0;
  const commentScore = maxComments > 0 ? (commentCount || 0) / maxComments : 0;

  const raw = 0.5 * regScore + 0.3 * upvoteScore + 0.2 * commentScore;
  return Math.max(0.1, Math.min(1, raw));
}

export async function getCollaborativeScores(userId, excludeIds, models) {
  const userRegs = await models.Registration.find({ user: userId }).select('event').lean();
  const userBookmarks = await models.Bookmark.find({ user: userId }).select('event').lean();
  const userUpvotes = await models.Upvote.find({ user: userId }).select('event').lean();

  const seedEventIds = [
    ...new Set([
      ...userRegs.map(r => r.event.toString()),
      ...userBookmarks.map(b => b.event.toString()),
      ...userUpvotes.map(u => u.event.toString()),
    ]),
  ];
  if (seedEventIds.length === 0) return new Map();

  const similarRegUsers = await models.Registration.distinct('user', { event: { $in: seedEventIds }, user: { $ne: userId } });
  const similarBmUsers = await models.Bookmark.distinct('user', { event: { $in: seedEventIds }, user: { $ne: userId } });
  const similarUpUsers = await models.Upvote.distinct('user', { event: { $in: seedEventIds }, user: { $ne: userId } });

  const similarUserIds = [
    ...new Set([
      ...similarRegUsers.map(id => id.toString()),
      ...similarBmUsers.map(id => id.toString()),
      ...similarUpUsers.map(id => id.toString()),
    ]),
  ];
  if (similarUserIds.length === 0) return new Map();

  const allExcludeIds = [...new Set([...seedEventIds, ...excludeIds.map(id => id.toString())])];

  const collabFromRegs = await models.Registration.aggregate([
    { $match: { user: { $in: similarUserIds }, event: { $nin: allExcludeIds } } },
    { $group: { _id: '$event', count: { $sum: 1 } } },
  ]);
  const collabFromBms = await models.Bookmark.aggregate([
    { $match: { user: { $in: similarUserIds }, event: { $nin: allExcludeIds } } },
    { $group: { _id: '$event', count: { $sum: 1 } } },
  ]);
  const collabFromUps = await models.Upvote.aggregate([
    { $match: { user: { $in: similarUserIds }, event: { $nin: allExcludeIds } } },
    { $group: { _id: '$event', count: { $sum: 1 } } },
  ]);

  const merged = {};
  for (const r of collabFromRegs) merged[r._id.toString()] = (merged[r._id.toString()] || 0) + r.count;
  for (const b of collabFromBms) merged[b._id.toString()] = (merged[b._id.toString()] || 0) + b.count;
  for (const u of collabFromUps) merged[u._id.toString()] = (merged[u._id.toString()] || 0) + u.count;

  const maxCount = Math.max(...Object.values(merged), 1);
  const scores = new Map();
  for (const [eid, count] of Object.entries(merged)) {
    scores.set(eid, count / maxCount);
  }
  return scores;
}

export async function getUpvoteAffinityScores(userId, excludeIds, models) {
  const userUpvotes = await models.Upvote.find({ user: userId }).select('event').lean();
  const upvotedEventIds = userUpvotes.map(u => u.event.toString());
  if (upvotedEventIds.length === 0) return new Map();

  const upvoters = await models.Upvote.distinct('user', { event: { $in: upvotedEventIds }, user: { $ne: userId } });
  if (upvoters.length === 0) return new Map();

  const allExcludeIds = [...new Set([...upvotedEventIds, ...excludeIds.map(id => id.toString())])];

  const affinity = await models.Upvote.aggregate([
    { $match: { user: { $in: upvoters }, event: { $nin: allExcludeIds } } },
    { $group: { _id: '$event', count: { $sum: 1 } } },
  ]);

  const maxCount = Math.max(...affinity.map(a => a.count), 1);
  const scores = new Map();
  for (const a of affinity) {
    scores.set(a._id.toString(), a.count / maxCount);
  }
  return scores;
}

export async function getCommentKeywordScores(userId, eventIds, models) {
  const userComments = await models.Comment.find({ user: userId }).select('text').lean();
  if (userComments.length === 0) return new Map();

  const userTexts = userComments.map(c => c.text);
  const userProfile = buildKeywordProfile(userTexts);
  if (Object.keys(userProfile).length === 0) return new Map();

  const allEventComments = await models.Comment.aggregate([
    { $match: { event: { $in: eventIds } } },
    { $group: { _id: '$event', texts: { $push: '$text' } } },
  ]);

  const scores = new Map();
  for (const group of allEventComments) {
    const eventKeywords = [];
    for (const text of group.texts) {
      const { extractKeywords } = await import('./keywordExtractor.js');
      eventKeywords.push(...extractKeywords(text));
    }
    const similarity = computeKeywordSimilarity(userProfile, [...new Set(eventKeywords)]);
    if (similarity > 0) {
      scores.set(group._id.toString(), similarity);
    }
  }
  return scores;
}

export function computeReason(scores) {
  const parts = [];
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

export function clearRecommendationCache(userId) {
  cache.remove(userId.toString());
}

export async function getRecommendations(user, excludeIds) {
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
  const maxRegCount = Math.max(...regCounts.map(r => r.count), 1);

  const upvoteCounts = await Upvote.aggregate([
    { $match: { event: { $in: allEventIds } } },
    { $group: { _id: '$event', count: { $sum: 1 } } },
  ]);
  const upvoteMap = new Map(upvoteCounts.map(u => [u._id.toString(), u.count]));
  const maxUpvoteCount = Math.max(...upvoteCounts.map(u => u.count), 1);

  const commentCounts = await Comment.aggregate([
    { $match: { event: { $in: allEventIds } } },
    { $group: { _id: '$event', count: { $sum: 1 } } },
  ]);
  const commentMap = new Map(commentCounts.map(c => [c._id.toString(), c.count]));
  const maxCommentCount = Math.max(...commentCounts.map(c => c.count), 1);

  const collabScores = hasHistory
    ? await getCollaborativeScores(user._id, excludeIds, { Registration, Bookmark, Upvote })
    : new Map();

  const upvoteAffinityScores = hasHistory
    ? await getUpvoteAffinityScores(user._id, excludeIds, { Upvote })
    : new Map();

  const keywordScores = await getCommentKeywordScores(user._id, allEventIds, { Comment });

  const hasInterests = userInterests.length > 0;
  let catWeight, collabWeight, popWeight, recWeight, kwWeight, upAffWeight;

  if (!hasHistory && hasInterests) {
    catWeight = 0.40; popWeight = 0.30; recWeight = 0.20; collabWeight = 0; kwWeight = 0.10; upAffWeight = 0;
  } else if (!hasInterests) {
    catWeight = 0; popWeight = 0.35; collabWeight = 0.25; recWeight = 0.15; kwWeight = 0.10; upAffWeight = 0.15;
  } else {
    catWeight = 0.25; collabWeight = 0.20; popWeight = 0.15; recWeight = 0.10; kwWeight = 0.10; upAffWeight = 0.20;
  }

  const scored = allPublished.map(event => {
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
      maxCommentCount,
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
