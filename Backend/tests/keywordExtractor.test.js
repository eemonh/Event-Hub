import { describe, it } from 'node:test';
import assert from 'node:assert';
import { extractKeywords, buildKeywordProfile, computeKeywordSimilarity } from '../src/utils/keywordExtractor.js';

describe('extractKeywords', () => {
  it('returns empty array for null input', () => {
    assert.deepStrictEqual(extractKeywords(null), []);
  });

  it('returns empty array for empty string', () => {
    assert.deepStrictEqual(extractKeywords(''), []);
  });

  it('extracts technical terms', () => {
    const result = extractKeywords('I love react and node');
    assert(result.includes('react'));
    assert(result.includes('node'));
  });

  it('extracts hashtags without the hash', () => {
    const result = extractKeywords('Check out #javascript');
    assert(result.includes('javascript'));
  });

  it('filters out stop words but keeps meaningful words', () => {
    const result = extractKeywords('the workshop was great');
    assert.ok(!result.includes('the'));
    assert.ok(!result.includes('was'));
    assert.ok(result.includes('workshop') || result.includes('great'));
  });

  it('deduplicates keywords', () => {
    const result = extractKeywords('react react react');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0], 'react');
  });

  it('ignores words shorter than 3 characters', () => {
    const result = extractKeywords('hi go ok');
    assert.strictEqual(result.length, 0);
  });
});

describe('buildKeywordProfile', () => {
  it('returns empty object for empty input', () => {
    assert.deepStrictEqual(buildKeywordProfile([]), {});
  });

  it('builds frequency profile from multiple texts', () => {
    const profile = buildKeywordProfile(['I love react', 'react is great', 'react and node']);
    assert(profile.react >= 0.5, `Expected react weight >= 0.5, got ${profile.react}`);
  });
});

describe('computeKeywordSimilarity', () => {
  it('returns 0 for empty profile', () => {
    assert.strictEqual(computeKeywordSimilarity({}, ['react']), 0);
  });

  it('returns 0 for empty event keywords', () => {
    assert.strictEqual(computeKeywordSimilarity({ react: 1 }, []), 0);
  });

  it('returns positive similarity when keywords overlap', () => {
    const similarity = computeKeywordSimilarity({ react: 1, node: 0.5 }, ['react', 'graphql']);
    assert(similarity > 0, `Expected > 0, got ${similarity}`);
  });

  it('returns 0 when no keywords overlap', () => {
    const similarity = computeKeywordSimilarity({ python: 1 }, ['react', 'node']);
    assert.strictEqual(similarity, 0);
  });
});
