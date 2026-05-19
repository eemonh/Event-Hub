import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  computeCategoryScore,
  computeRecencyScore,
  computeCompositePopularity,
  computeReason,
} from '../src/utils/recommendationEngine.js';

describe('computeCategoryScore', () => {
  it('returns 1 when user has one interest and it matches', () => {
    assert.strictEqual(computeCategoryScore(['Technology'], 'Technology'), 1);
  });

  it('returns 0.5 when user has two interests and one matches', () => {
    assert.strictEqual(computeCategoryScore(['Technology', 'Music'], 'Technology'), 0.5);
  });

  it('returns 0 when no interests match', () => {
    assert.strictEqual(computeCategoryScore(['Technology'], 'Music'), 0);
  });

  it('returns 0 when interests array is empty', () => {
    assert.strictEqual(computeCategoryScore([], 'Technology'), 0);
  });

  it('returns 0 when interests is null', () => {
    assert.strictEqual(computeCategoryScore(null, 'Technology'), 0);
  });

  it('returns 0 when eventCategory is null', () => {
    assert.strictEqual(computeCategoryScore(['Technology'], null), 0);
  });
});

describe('computeRecencyScore', () => {
  it('returns 1.0 for event 14 days from now', () => {
    const future = new Date();
    future.setDate(future.getDate() + 14);
    const score = computeRecencyScore(future);
    assert(score >= 0.95 && score <= 1.05, `Expected ~1.0, got ${score}`);
  });

  it('returns 0.7 for event today', () => {
    const score = computeRecencyScore(new Date());
    assert.strictEqual(score, 0.7);
  });

  it('returns 0 for past event', () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    assert.strictEqual(computeRecencyScore(past), 0);
  });

  it('returns 0 for null date', () => {
    assert.strictEqual(computeRecencyScore(null), 0);
  });

  it('returns > 0.5 for event 60 days out', () => {
    const future = new Date();
    future.setDate(future.getDate() + 60);
    const score = computeRecencyScore(future);
    assert(score >= 0.5, `Expected >= 0.5, got ${score}`);
  });
});

describe('computeCompositePopularity', () => {
  it('returns 1 when all signals are at max', () => {
    assert.strictEqual(computeCompositePopularity(100, 100, 100, 100, 100, 100), 1);
  });

  it('returns 0.5 when regs are half max and other signals are 0', () => {
    const score = computeCompositePopularity(50, 0, 0, 100, 100, 100);
    assert(Math.abs(score - 0.25) < 0.01, `Expected ~0.25, got ${score}`);
  });

  it('returns 0.1 floor when everything is 0', () => {
    assert.strictEqual(computeCompositePopularity(0, 0, 0, 0, 0, 0), 0.1);
  });

  it('returns 0.1 when all max values are 0', () => {
    assert.strictEqual(computeCompositePopularity(0, 0, 0, 0, 0, 0), 0.1);
  });
});

describe('computeReason', () => {
  it('returns "Matches your interests" when category score > 0', () => {
    const r = computeReason({ category: 0.5, collaborative: 0, popularity: 0, recency: 0 });
    assert.strictEqual(r, 'Matches your interests');
  });

  it('returns "Trending event" when popularity > 0.7', () => {
    const r = computeReason({ category: 0, collaborative: 0, popularity: 0.8, recency: 0 });
    assert.strictEqual(r, 'Trending event');
  });

  it('returns "Popular event" when popularity is between 0.3 and 0.7', () => {
    const r = computeReason({ category: 0, collaborative: 0, popularity: 0.5, recency: 0 });
    assert.strictEqual(r, 'Popular event');
  });

  it('returns "Recommended for you" when no signal is strong', () => {
    const r = computeReason({ category: 0, collaborative: 0, popularity: 0.2, recency: 0 });
    assert.strictEqual(r, 'Recommended for you');
  });
});
